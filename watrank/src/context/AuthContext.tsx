"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useToast } from "@/components/ui/use-toast";

export type AuthFetch = (
    input: string,
    init?: RequestInit
) => Promise<Response>;

type AuthContextType = {
    // Short-lived access token, kept in memory only. It is renewed
    // automatically from the HttpOnly refresh token cookie.
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    authIsLoading: boolean;
    isAdmin: () => boolean;
    // fetch that attaches the access token and, on a 401, refreshes it once
    // and retries.
    authFetch: AuthFetch;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ExtendedJwtPayload extends JwtPayload {
    admin: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Renew the access token this long before it expires.
const REFRESH_MARGIN_MS = 60 * 1000;

// Asks the backend for a new access token using the refresh token cookie.
// Returns null when the user is not logged in (or their login has ended).
// Refreshes are serialized across tabs, since each one rotates the cookie.
async function requestRefresh(): Promise<string | null> {
    const doRefresh = async (): Promise<string | null> => {
        for (let attempt = 0; attempt < 2; attempt++) {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                const { token } = await res.json();
                return token;
            }
            // 409: another tab rotated the cookie at the same moment; retry with the new one.
            if (res.status !== 409) {
                return null;
            }
        }
        return null;
    };

    if (typeof navigator !== "undefined" && navigator.locks) {
        return navigator.locks.request("watrank-auth-refresh", doRefresh);
    }
    return doRefresh();
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [token, setToken] = useState<string | null>(null);
    const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    const tokenRef = useRef<string | null>(null);
    const refreshPromise = useRef<Promise<string | null> | null>(null);

    const updateToken = useCallback((next: string | null) => {
        tokenRef.current = next;
        setToken(next);
    }, []);

    // Deduplicates concurrent refreshes within this tab.
    const refresh = useCallback((): Promise<string | null> => {
        if (!refreshPromise.current) {
            const startToken = tokenRef.current;
            refreshPromise.current = requestRefresh()
                .catch(() => null)
                .then((next) => {
                    // Don't let a failed refresh undo a login that happened meanwhile.
                    if (next !== null || tokenRef.current === startToken) {
                        updateToken(next);
                    }
                    return next ?? tokenRef.current;
                })
                .finally(() => {
                    refreshPromise.current = null;
                });
        }
        return refreshPromise.current;
    }, [updateToken]);

    // Restore the login from the refresh token cookie on page load.
    useEffect(() => {
        // Tokens used to live in a JS-readable cookie; drop any leftovers.
        Cookies.remove("token");
        refresh().finally(() => setAuthIsLoading(false));
    }, [refresh]);

    // Renew the access token shortly before it expires.
    useEffect(() => {
        if (!token) return;
        const { exp } = jwtDecode(token);
        if (!exp) return;
        const delay = Math.max(exp * 1000 - Date.now() - REFRESH_MARGIN_MS, 0);
        const timer = setTimeout(refresh, delay);
        return () => clearTimeout(timer);
    }, [token, refresh]);

    const authFetch = useCallback(
        async (input: string, init: RequestInit = {}) => {
            const withToken = (t: string | null) => {
                const headers = new Headers(init.headers);
                if (t) headers.set("Authorization", `Bearer ${t}`);
                return fetch(input, { ...init, headers });
            };

            const current = tokenRef.current ?? (await refreshPromise.current);
            const res = await withToken(current ?? null);
            if (res.status !== 401) return res;

            const next = await refresh();
            if (!next) return res;
            return withToken(next);
        },
        [refresh]
    );

    const login = (token: string) => {
        updateToken(token);
        toast({ title: "Log in successful!" });
    };

    const logout = () => {
        fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).catch(() => {});
        updateToken(null);
        toast({ title: "Log out successful!" });
    };

    const isLoggedIn = () => token !== null;

    const isAdmin = () =>
        token !== null && jwtDecode<ExtendedJwtPayload>(token)?.admin;

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isLoggedIn,
                authIsLoading,
                isAdmin,
                authFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

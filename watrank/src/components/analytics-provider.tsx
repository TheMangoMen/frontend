"use client";

import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { identify, initAnalytics } from "@/lib/analytics";

// Runs at import so PostHog is ready before any page effect fires.
initAnalytics();

interface ExtendedJwtPayload extends JwtPayload {
    admin: boolean;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();

    // Tie this browser's events to the logged-in user (their WatIAM id).
    useEffect(() => {
        if (!token) return;
        const { sub, admin } = jwtDecode<ExtendedJwtPayload>(token);
        if (sub) identify(sub, { is_admin: !!admin });
    }, [token]);

    return <>{children}</>;
}

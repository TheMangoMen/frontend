import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowDown,
    ChevronDown,
    ClipboardPaste,
    LineChart,
    LogOut,
    ShieldHalf,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/app/login/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import JobIDExtractor from "@/components/job-id-extractor";
import { useEffect, useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

interface CommandKeyProps {
    text: string;
}

const CommandKey: React.FC<CommandKeyProps> = ({ text }) => {
    const [commandKey, setCommandKey] = useState("");

    useEffect(() => {
        const isMac = navigator.userAgent.includes("Mac");
        setCommandKey(isMac ? "⌘ " : "Ctrl+");
    }, []);

    return (
        <span className="bg-muted p-1 rounded-md shadow-md">
            <code className="font-mono text-sm">
                {commandKey}
                {text}
            </code>
        </span>
    );
};

export function User() {
    const currentUrl = usePathname();
    const { token, logout, authIsLoading, isAdmin } = useAuth();
    const router = useRouter();
    const logoutAndRedirect = () => {
        logout();
        router.replace("/");
    };

    if (currentUrl == "/login") {
        return;
    }

    if (authIsLoading) {
        return <Skeleton className="w-12 h-9 bg-zinc-100 dark:bg-muted" />;
    }

    if (token !== null) {
        return (
            <DropdownMenu>
                <Button variant="ghost">
                    <DropdownMenuTrigger asChild>
                        <div className="flex flex-row gap-1 items-center">
                            <span className="text-base font-medium cursor-pointer">
                                {jwtDecode(token).sub}
                            </span>
                            <ChevronDown size={20} />
                        </div>
                    </DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent>
                    <Link href="/analytics">
                        <DropdownMenuItem className="cursor-pointer">
                            <LineChart className="mr-2 h-4 w-4" />
                            <span>Analytics</span>
                        </DropdownMenuItem>
                    </Link>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                            <ClipboardPaste className="mr-2 h-4 w-4" />
                            <span>Import jobs</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    {isAdmin() && (
                        <>
                            <DropdownMenuSeparator />
                            <Link href="/admin">
                                <DropdownMenuItem className="cursor-pointer">
                                    <ShieldHalf className="mr-2 h-4 w-4" />
                                    <span>Admin dashboard</span>
                                </DropdownMenuItem>
                            </Link>
                        </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={logoutAndRedirect}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button>
            <Link href="/login" className="text-base font-medium w-12">
                Log In
            </Link>
        </Button>
    );
}

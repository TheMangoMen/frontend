import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { Icons } from "@/app/login/components/icons";
import { Skeleton } from "@/components/ui/skeleton"


export function User() {
    const currentUrl = usePathname();
    const { token, logout, authIsLoading } = useAuth()

    if (currentUrl == "/login") {
        return
    }

    if (authIsLoading) {
        // return <Icons.spinner className="h-4 w-4 animate-spin" />
        return <Skeleton className="w-[100px] h-9 bg-zinc-100 dark:bg-muted" />
    }

    if (token !== null) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{jwtDecode(token).sub}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="justify-center" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return <Button asChild>
        <Link href="/login">
            Log In
        </Link>
    </Button>;
}

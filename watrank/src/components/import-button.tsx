import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton"

export function Import() {
    const currentUrl = usePathname();
    const { token, isLoggedIn, authIsLoading } = useAuth()

    if (isLoggedIn() && currentUrl == "/import") {
        return
    }

    if (authIsLoading) {
        return <Skeleton className="w-[100px] h-9 bg-zinc-100 dark:bg-muted" />
    }

    if (token !== null) {
        return (<Button asChild>
            <Link href="/import">
                Import
            </Link>
        </Button>)
    }
}

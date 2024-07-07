import { ChevronsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Logo() {
    return (
        // <Button variant="ghost" className="p-2" asChild>
        <Link href="/jobs">
            <div className="text-2xl flex gap-2 justify-start">
                <ChevronsUp className="text-primary" width={"1.2em"} height={"1.2em"} strokeWidth={3} strokeLinecap="square" />
                <div className="font-light">Wat<span className="font-bold ">Rank</span></div>
            </div>
        </Link>
        // </Button>
    )
}
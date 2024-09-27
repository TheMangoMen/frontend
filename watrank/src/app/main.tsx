"use client"

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import LandingPage from "./page";


export default function Main({ children }: Readonly<{ children: React.ReactNode }>) {
    const currentUrl = usePathname();
    if (currentUrl === '/') {
        return <LandingPage />
    } else {
        return <main className={"dark:bg-black bg-muted/70 text-foreground"}>
            <ThemeProvider attribute="class"
                defaultTheme="light"
                disableTransitionOnChange>
                <TooltipProvider>
                    <div className="h-screen box-border flex flex-col overflow-auto">
                        <Header />
                        <div className="flex-grow flex flex-col w-full max-w-6xl px-4 md:px-8 py-5 mx-auto">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </TooltipProvider>
            </ThemeProvider>
            <Toaster />
        </main>
    }
}
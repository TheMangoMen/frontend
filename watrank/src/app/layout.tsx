import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { Header } from "@/components/header";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WatRank",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={cn(inter.className, "antialiased bg-stone-50 dark:bg-black")}>
                    <ThemeProvider attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange>
                        <div className="min-h-screen box-border flex flex-col">
                            <Header />
                            <div className="flex-grow flex flex-col w-full max-w-6xl px-8 mx-auto h-full">
                                {children}
                            </div>
                        </div>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </AuthProvider>
        </html>

    );
}

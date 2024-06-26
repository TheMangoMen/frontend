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
                <body className={cn(inter.className, "antialiased")}>
                    <ThemeProvider attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange>
                        <div className="flex flex-col h-screen">
                            <Header />
                            {children}
                        </div>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </AuthProvider>
        </html>

    );
}

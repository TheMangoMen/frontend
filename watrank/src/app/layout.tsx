import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalProvider } from "@/context/StageContext";
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WatRank",
    description: "Navigate co-op with confidence.",
    openGraph: {
        type: "website",
        url: "https://watrank.com",
        title: "WatRank",
        description: "Navigate co-op with confidence.",
        siteName: "WatRank",
        images: [{
            url: "/banner.png",
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "WatRank",
        description: "Navigate co-op with confidence.",
        images: "/banner.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Analytics />
            <GlobalProvider>
                <AuthProvider>
                    <body className={cn(inter.className, "antialiased dark:bg-black bg-muted/70 text-foreground")}>
                        <ThemeProvider attribute="class"
                            defaultTheme="dark"
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
                    </body>
                </AuthProvider>
            </GlobalProvider>
        </html >

    );
}

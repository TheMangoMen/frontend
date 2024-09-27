import type { Metadata } from "next";
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
import Main from "./main"
import { Inter } from "next/font/google";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <Analytics />
            <GlobalProvider>
                <AuthProvider>
                    <body className={cn(inter.className, "antialiased ")}>
                        <Main children={children} />
                    </body>
                </AuthProvider>
            </GlobalProvider>
        </html >
    );
}

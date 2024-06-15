import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ChevronUpCircleIcon, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange>
        <div>
        <header className="bg-background flex items-center justify-between px-10 py-10 sticky h-[60px] left-0 right-0 top-0 z-[100]">
        <div className="text-2xl flex gap-2 justify-start">
          <ChevronsUp className="text-primary" width={"1.2em"} height={"1.2em"} strokeWidth={3} strokeLinecap="square"/>
          <div className="font-light">Wat<span className="font-bold ">Rank</span></div>
        </div>
        <div className="flex gap-5">
          <Button>Sign Up</Button>
          <div className="justify-end"><ModeToggle/></div>
        </div> 
        </header>
        {children}
        </div>
          </ThemeProvider></body>
    </html>
  );
}

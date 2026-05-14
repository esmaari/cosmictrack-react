import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

import { ReactQueryProvider } from "@/shared/lib/react-query/ReactQueryProvider"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/shared/ui/Header"
import SiteFooter from "@/shared/ui/SiteFooter"

export const metadata: Metadata = {
  title: "CosmicTrack",
  description: "Track your journey, one step at a time.",
  icons: {
    icon: "/logos/Logo_CT_Badge.png",
    apple: "/logos/Logo_CT_Badge.png",
  },
}

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const forumFont = localFont({
  src: "./fonts/Forum-Regular.ttf",
  variable: "--font-forum",
});

const robotoFont = localFont({
  src: [
    {
      path: "./fonts/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
});

export default function RootLayout({
  children, //destructuring the children prop: vue daki slot gibi
}: Readonly<{ //readonly: readonly olarak tanımlanır: children propu sadece okunabilir olarak tanımlanır yani bu layout icinde degistirilemez
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", forumFont.variable, robotoFont.variable, "font-sans", geist.variable)}
    >
     
      <body className="flex min-h-full flex-col">
        <ReactQueryProvider>
          <Toaster />
          <Header />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <SiteFooter />
        </ReactQueryProvider>  
      </body>
    </html>
  );
}
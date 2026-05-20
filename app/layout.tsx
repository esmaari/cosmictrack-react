import type { Metadata } from "next"
import localFont from "next/font/local"
import { getLocale } from "next-intl/server"
import "./globals.css"

import { ReactQueryProvider } from "@/shared/lib/react-query/ReactQueryProvider"
import { ProfileProvider } from "@/shared/lib/ProfileProvider"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "CosmicTrack",
  description: "Track your journey, one step at a time.",
  icons: {
    icon: "/favicon.ico",
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

export default async function RootLayout({
  children, //destructuring the children prop: vue daki slot gibi
}: Readonly<{ //readonly: readonly olarak tanımlanır: children propu sadece okunabilir olarak tanımlanır yani bu layout icinde degistirilemez
  children: React.ReactNode;
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", forumFont.variable, robotoFont.variable, "font-sans", geist.variable)}
    >
     
      <body className="flex min-h-full flex-col">
        <ReactQueryProvider>
          <ProfileProvider>
            <Toaster />
            {children}
          </ProfileProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
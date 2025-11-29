import type { Metadata } from "next";
import { Geist, Geist_Mono,Poppins,Cormorant_Garamond,Lato} from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

const lato=Lato({
  variable:"--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"]
})

const cormorantGaramond=Cormorant_Garamond({
  variable:"--font-cormorant-garamond",
  subsets: ["latin"],
   weight:["300","400","500","600","700"]
})

const poppins=Poppins({
  variable:"--font-poppins",
  subsets: ["latin"],
   weight:["100","200","300","400","500","600","700","800","900"]
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hospital AI Operations Dashboard",
  description: "AI-powered dashboard for hospital operations management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${cormorantGaramond.variable} ${lato.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

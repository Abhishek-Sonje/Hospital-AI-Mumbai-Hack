import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
 
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            <Sidebar />
            <div className="flex flex-col md:pl-64">
              <Topbar />
              <main className="flex-1 p-4 md:p-6 mt-14">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

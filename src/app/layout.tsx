import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpotiQuiz",
  description: "Test your Spotify music knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SupabaseProvider>
            <Header />
            <main className="min-h-screen justify-center items-center flex flex-col w-full" >
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" />
          </SupabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

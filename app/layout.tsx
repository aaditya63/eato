import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./helper/ReduxProvider";
import AppInit from "./helper/Init";
import Toast from "./helper/Toast";
import Navbar from "@/components/landingpage/Navbar";
import Footer from "@/components/landingpage/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eato - Delicious Starts Here.",
  description: "Eato Food Ording WebApp, Get your Food in just 45 Min",
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
        <ReduxProvider>
          <AppInit />
          <Toast/>
          <Navbar/>
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}

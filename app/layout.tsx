import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "./components/Navbar";
import NavbarSimple from "./components/NavbarSimple";
import NavbarSimpleJsx from "./components/navbarSimpleJsx";

const ppNeueMontreal = localFont({
  src: [
    {
      path: "../public/fonts/pp_neue_montreal/ppneuemontreal-bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/pp_neue_montreal/ppneuemontreal-book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/pp_neue_montreal/ppneuemontreal-italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/pp_neue_montreal/ppneuemontreal-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/pp_neue_montreal/ppneuemontreal-thin.woff",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-p-n-montreal",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropdown Navbar",
  description: "Dropdown Navbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${ppNeueMontreal.variable} antialiased`}
    >
      <body>
        <NavbarSimple />
        {children}
      </body>
    </html>
  );
}

import "../style/globals.css";
import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { SWRProvider } from "@/provider/StoreProvider";
import ConditionalHeader from "./components/molecules/ConditionalHeader";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fallenway",
  description: "Skemap App",
  icons: {
    icon: "fallenway-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased w-full min-h-screen flex flex-col bg-bg text-text`}
      >
        {/* Background layer */}
        <div className="app-bg" aria-hidden="true">
          <div className="app-bg__orb app-bg__orb--1" />
          <div className="app-bg__orb app-bg__orb--2" />
          <div className="app-bg__orb app-bg__orb--3" />
          <div className="app-bg__ring app-bg__ring--1" />
          <div className="app-bg__ring app-bg__ring--2" />
          <div className="app-bg__ring app-bg__ring--3" />
        </div>

        <SWRProvider>
          <ConditionalHeader />
          <div className="relative z-10 max-w-screen-2xl mx-auto flex-1 w-full flex flex-col px-4 sm:px-6 h-full">
            {children}
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}

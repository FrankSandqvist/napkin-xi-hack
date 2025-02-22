import type { Metadata } from "next";
import { Kode_Mono, Rowdies } from "next/font/google";
import "./globals.css";
import { ClientConversation } from "../components/client-conversation";

const _ = Rowdies({
  weight: "400",
  subsets: ["latin"],
});
const __ = Kode_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NAPKIN",
  description: "NAPKIN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="absolute left-0 top-0 bottom-0 right-0 flex items-stretch justify-center bg-slate-100">
          <div className="flex flex-col w-[40rem] overflow-y-scroll lg:px-12">
            <div className="flex flex-col bg-slate-50 border-l border-r border-black px-6 lg:pt-12 flex-grow">
              {children}
              <div className="flex-grow" />
            </div>
          </div>
          <ClientConversation />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Toaster } from "@/components/ui/sonner"
import { TenstackProviders } from "./tenstack-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cyfrin Audit Checklist with Ai",
  description: "Cyfrin Audit Checklist with Ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !scroll-smooth`}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: 'hsl(20.5 90.2% 48.2%)',
            },
          }}


        >
          <TenstackProviders>
            <Toaster
              duration={10000}
              richColors={true}
              theme="dark"
              position="top-right"
              closeButton={true}

            />

            <AdminPanelLayout>
              <Analytics />
              {children}
            </AdminPanelLayout>
          </TenstackProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}

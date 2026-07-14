import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { AuthSuccessToast } from "@/components/AuthSuccessToast";
import { AuthTokenRefresh } from "@/components/AuthTokenRefresh";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { site } from "@/data/site";
import { getSession } from "@/lib/session";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} Muslims Network`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: site.logoSrc,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session
    ? { name: session.name, email: session.email }
    : null;

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-mist font-sans text-ink">
        <AuthTokenRefresh />
        <Header user={user} />
        <AuthSuccessToast />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyWhatsApp />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from '@/components/ui/Toast';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: "LiveKit Dashboard",
  description: "Monitor your LiveKit server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-surface-50/30 antialiased">
        <div className="min-h-screen">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}

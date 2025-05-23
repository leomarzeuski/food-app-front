import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { UserProvider } from "@/context/userContext";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodFácil - Delivery de comida rápido e prático",
  description: "Peça comida dos melhores restaurantes da sua região",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UserProvider>
            <main className="container mx-auto px-4 py-4">
              {children}
              <Toaster />
            </main>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

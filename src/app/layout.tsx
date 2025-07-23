import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TooltipProvider } from "@/components/Tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvalTCC - Sistema de Avaliação Acadêmica",
  description: "Plataforma moderna para avaliação de Trabalhos de Conclusão de Curso com geração de PDFs e links pré-preenchidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-200`}
        suppressHydrationWarning
      >
        <Script
          src="https://rastro-tracker-production.up.railway.app/rastro.js"
          data-site="cmdfa1vku0003nt7atgwxfbsq"
          data-api="https://rastro-api-production.up.railway.app"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

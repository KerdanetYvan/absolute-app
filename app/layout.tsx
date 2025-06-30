import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import "./tailwind-input.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANOMI - Écoles d'Animation",
  description: "Découvrez les meilleures écoles d'animation en France. Trouvez votre école idéale et explorez les formations en animation 2D/3D, effets spéciaux et cinéma d'animation.",
  keywords: ["animation", "écoles", "formation", "cinéma", "2D", "3D", "effets spéciaux"],
  authors: [{ name: "ANOMI Team" }],
  creator: "ANOMI",
  publisher: "ANOMI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://anomi-six.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ANOMI - Écoles d'Animation",
    description: "Découvrez les meilleures écoles d'animation en France",
    url: 'https://anomi-six.vercel.app/',
    siteName: 'ANOMI', 
images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'ANOMI - Écoles d\'Animation',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANOMI - Écoles d\'Animation',
    description: 'Découvrez les meilleures écoles d\'animation en France',
    images: ['/logo.webp'],
  },
  manifest: '/manifest.json',
  themeColor: '#FEB157',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ANOMI',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ANOMI',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ANOMI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FEB157" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
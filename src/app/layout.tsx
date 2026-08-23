import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kelevra Corp | Infraestrutura de IA para Negócios Locais",
  description:
    "Implantação 100% feita pelo nosso time técnico. Sistema no ar em 72h. Selecione sua infraestrutura e comece hoje.",
  keywords: ["automação WhatsApp", "cardápio digital", "Google Maps", "anti no-show", "IA para restaurantes", "Kelevra"],
  authors: [{ name: "Kelevra Corp" }],
  openGraph: {
    title: "Kelevra Corp | Infraestrutura de IA para Negócios Locais",
    description: "Implantação 100% feita pelo nosso time. Sistema no ar em 72h. Sem fidelidade.",
    url: "https://pay.kelevra.shop",
    siteName: "Kelevra Corp",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://pay.kelevra.shop/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kelevra Corp — Infraestrutura de IA para Negócios Locais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelevra Corp | Infraestrutura de IA",
    description: "Implantação 100% feita pelo nosso time. Sistema no ar em 72h.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="canonical" href="https://pay.kelevra.shop" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Kelevra Corp",
              description:
                "Infraestrutura de IA para negócios locais. Automação de WhatsApp, Google Maps, cardápio digital e sistema anti no-show.",
              url: "https://pay.kelevra.shop",
              telephone: "+5561981849873",
              address: {
                "@type": "PostalAddress",
                addressRegion: "DF",
                addressCountry: "BR",
              },
              priceRange: "R$ 700 – R$ 1.500 setup",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Infraestruturas Kelevra",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: "Cardápio Que Vende" },
                    price: "700",
                    priceCurrency: "BRL",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: "Presença Blindada" },
                    price: "800",
                    priceCurrency: "BRL",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: "Anti No-Show" },
                    price: "1500",
                    priceCurrency: "BRL",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col cursor-none">{children}</body>
    </html>
  );
}

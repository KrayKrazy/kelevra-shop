import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
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
<<<<<<< Updated upstream
    url: "https://kelevra.shop",
=======
    url: "https://forms.kelevra.shop",
>>>>>>> Stashed changes
    siteName: "Kelevra Corp",
    locale: "pt_BR",
    type: "website",
    images: [
      {
<<<<<<< Updated upstream
        url: "https://kelevra.shop/og-image.png",
=======
        url: "https://forms.kelevra.shop/og-image.png",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <link rel="canonical" href="https://kelevra.shop" />
=======
        <link rel="canonical" href="https://forms.kelevra.shop" />
>>>>>>> Stashed changes
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
<<<<<<< Updated upstream
              "@graph": [
                {
                  "@type": "ProfessionalService",
                  "@id": "https://kelevra.shop/#organization",
                  "name": "Kelevra Corp",
                  "description": "Agência especializada em infraestrutura de IA, automação e SEO Local (GEO Hub) para negócios locais no Entorno do DF e Brasília. Acabamos com a Cegueira Digital.",
                  "url": "https://kelevra.shop",
                  "logo": "https://kelevra.shop/og-image.png",
                  "image": "https://kelevra.shop/og-image.png",
                  "telephone": "+5561981849873",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Santo Antônio do Descoberto",
                    "addressRegion": "GO",
                    "addressCountry": "BR"
=======
              "@type": "LocalBusiness",
              name: "Kelevra Corp",
              description:
                "Infraestrutura de IA para negócios locais. Automação de WhatsApp, Google Maps, cardápio digital e sistema anti no-show.",
              url: "https://forms.kelevra.shop",
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
>>>>>>> Stashed changes
                  },
                  "areaServed": ["Santo Antônio do Descoberto", "Brasília", "Distrito Federal", "Águas Lindas de Goiás"],
                  "priceRange": "R$ 700 - R$ 1.500",
                  "knowsAbout": ["Inteligência Artificial", "SEO Local", "Automação de WhatsApp", "Google Meu Negócio", "Cardápio Digital", "Sistemas Anti No-Show"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://kelevra.shop/#website",
                  "url": "https://kelevra.shop",
                  "name": "Kelevra Corp | Infraestrutura de IA",
                  "publisher": {
                    "@id": "https://kelevra.shop/#organization"
                  }
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Infraestruturas Kelevra",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Cardápio Que Vende (Integração WhatsApp)" },
                      "price": "700.00",
                      "priceCurrency": "BRL"
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Presença Blindada (Google Meu Negócio & SEO Local)" },
                      "price": "800.00",
                      "priceCurrency": "BRL"
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Sistema Anti No-Show (Automação de Agendamentos)" },
                      "price": "1500.00",
                      "priceCurrency": "BRL"
                    }
                  ]
                }
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col cursor-none">
        {children}

        {/* Meta Pixel - PageView base event */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1828719384743126');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1828719384743126&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PowerPax India | Exhibitor Portal",
  description: "Secure login for the PowerPax India Exhibitor Portal. Manage your event forms, badges, and company profile.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  metadataBase: new URL('https://powerpax.tresubmedia.com'),
  alternates: {
    canonical: '/',
  },
  // Added unique version to force cache bypass on hosting providers
  other: {
    "build-version": "1.0.9-stable"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          precedence="default"
        />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EBSS055VZ0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EBSS055VZ0');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

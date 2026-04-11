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
        <style id="critical-styles">
          {`
            .login-wrapper {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              min-height: 100vh !important;
              background: #f8fafc !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .login-card {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
              background: #ffffff !important;
              border-radius: 20px !important;
              padding: 40px !important;
              max-width: 450px !important;
              width: 90% !important;
              box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
              z-index: 999 !important;
              position: relative !important;
              color: #333 !important;
            }
            .bg-overlay {
              position: absolute !important;
              top: 0; left: 0; right: 0; bottom: 0;
              z-index: 1 !important;
              background-color: #f0f8ff !important;
            }
          `}
        </style>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EBSS055VZ0"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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

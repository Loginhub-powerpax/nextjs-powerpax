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
        <style id="full-design-system" dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: #84cc16;
            --primary-dark: #65a30d;
            --secondary: #0f172a;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-light: #64748b;
            --border: #e2e8f0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            background-color: var(--bg) !important;
            color: var(--text) !important;
            margin: 0 !important;
          }
          .login-wrapper, .dashboard-container {
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .login-wrapper {
            justify-content: center !important;
            align-items: center !important;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
          }
          .login-card, .card {
            background: var(--card-bg) !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
            padding: 2rem !important;
            border: 1px solid var(--border) !important;
            width: 100% !important;
            max-width: 450px !important;
          }
          .dashboard-header {
            background: #fff !important;
            padding: 1rem 2rem !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 2px solid var(--primary) !important;
          }
          .dashboard-tabs {
            display: flex !important;
            gap: 1rem !important;
            background: #fff !important;
            padding: 0 2rem !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .dashboard-content {
            padding: 2rem !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
          .form-list-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 1rem !important;
            background: #fff !important;
            border: 1px solid var(--border) !important;
            border-radius: 8px !important;
            margin-bottom: 0.75rem !important;
            text-decoration: none !important;
            color: inherit !important;
            transition: transform 0.2s !important;
          }
          .form-list-item:hover {
            transform: translateY(-2px) !important;
            border-color: var(--primary) !important;
          }
          .badge {
            padding: 4px 10px !important;
            border-radius: 999px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
          }
          .status-complete { background: #dcfce7 !important; color: #16a34a !important; }
          .status-pending { background: #fef9c3 !important; color: #a16207 !important; }
          .type-mandatory { background: #fee2e2 !important; color: #991b1b !important; }
          .btn-login, .btn-save {
            background-color: var(--primary) !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 0.75rem 1.5rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
          }
          .btn-login:hover { background-color: var(--primary-dark) !important; }
          input, select, textarea {
            width: 100% !important;
            padding: 0.75rem !important;
            border: 1px solid var(--border) !important;
            border-radius: 6px !important;
            margin-top: 0.5rem !important;
          }
        ` }} />
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

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PowerPax India | Exhibitor Portal",
  description: "Secure login for the PowerPax India Exhibitor Portal. Manage your event forms, badges, and company profile.",
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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

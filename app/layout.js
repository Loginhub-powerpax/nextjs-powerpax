import './globals.css';

export const metadata = {
  title: 'PowerPax India | Exhibitor Portal',
  description: 'Official exhibitor services portal for PowerPax India 2026',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Ultra-Resilience Branding: Restoring Original Orange & Navy Blue */}
        <style id="ultra-resilience-branding" dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: #FF9800;
            --primary-hover: #E68900;
            --secondary: #2c3e50;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text-dark: #333333;
            --text-muted: #666666;
            --border: #e0e0e0;
            --success: #4CAF50;
            --danger: #f44336;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            background-color: var(--bg) !important;
            color: var(--text-dark) !important;
            margin: 0 !important;
          }
          .dashboard-header {
            background-color: #fff !important;
            border-bottom: 3px solid var(--secondary) !important;
          }
          .btn-save, .btn-login, .btn-submit {
            background-color: var(--primary) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
          }
          .btn-save:hover, .btn-login:hover {
            background-color: var(--primary-hover) !important;
          }
          .badge.status-complete { 
            background-color: #e8f5e9 !important; 
            color: var(--success) !important; 
            border: 1px solid #c8e6c9 !important;
          }
          .badge.status-pending { 
            background-color: #fff3e0 !important; 
            color: var(--primary) !important; 
            border: 1px solid #ffe0b2 !important;
          }
          .badge-deadline { 
            border: 1px solid var(--danger) !important; 
            color: var(--danger) !important; 
            background-color: #fff !important;
          }
          header.dashboard-header.thin {
            border-bottom: 1px solid var(--border) !important;
          }
        `}} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {children}
      </body>
    </html>
  );
}

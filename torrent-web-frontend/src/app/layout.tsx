import "./globals.css";

export const metadata = {
  title: "Torrdown - Premium Movie Downloads",
  description: "A premium, award-winning torrent downloader experience. Download movies instantly in stunning quality.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Load premium fonts - Syne for display, Space Grotesk for body, JetBrains Mono for code */}
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Torrdown - Premium Torrent Downloader",
  description: "A minimalistic, award-winning torrent downloader interface",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

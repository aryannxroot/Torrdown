export const metadata = {
  title: "Torrdown",
  description: "Torrent downloader UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#111", color: "white" }}>
        {children}
      </body>
    </html>
  );
}

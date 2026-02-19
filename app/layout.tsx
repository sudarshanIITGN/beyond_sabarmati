import "./globals.css";

export const metadata = {
  title: "Question Bank Explorer",
  description: "Filter and explore questions (powered by NeonDB)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        
        {/* TOP BUBBLES LAYER */}
        {/* "absolute" positioning keeps them at the top. They will scroll away. */}
        <div className="bubbles-container">
          <div className="bubble b1" />
          <div className="bubble b2" />
          <div className="bubble b3" />
          <div className="bubble b4" />
          <div className="bubble b5" />
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
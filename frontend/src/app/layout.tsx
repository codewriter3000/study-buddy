import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Buddy",
  description: "Your personal flashcard study app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0c0e16", color: "#e2e4f9", fontFamily: "Manrope, sans-serif", minHeight: "100vh" }}>
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            backgroundColor: "rgba(42, 45, 62, 0.6)",
            borderBottom: "1px solid rgba(155, 158, 200, 0.1)",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: "linear-gradient(135deg, #ff6c95, #fd3e80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Study Buddy
              </span>
            </Link>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link href="/" style={{ color: "#9b9ec8", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem", transition: "color 0.2s" }}>
                Home
              </Link>
              <Link href="/study" style={{ color: "#9b9ec8", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem", transition: "color 0.2s" }}>
                Study
              </Link>
            </div>
          </div>
        </nav>
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Hashly — DeFi Security Intelligence",
  description: "AI-powered autonomous security agents that detect and prevent DeFi exploits in real-time on 0G Network.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata = {
  title: "nrivizi",
  description: "Your academic journey starts here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import Providers from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MaintenancePage from "@/app/maintenance/page";

export const metadata = {
  title: "nrivizi",
  description: "Your academic journey starts here",
};

// Set this to true when you want to enable maintenance mode
const MAINTENANCE_MODE = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {MAINTENANCE_MODE ? (
            <MaintenancePage />
          ) : (
            <Providers>{children}</Providers>
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}

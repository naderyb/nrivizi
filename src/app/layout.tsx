import "./globals.css";
import Providers from "./providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

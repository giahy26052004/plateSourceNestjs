import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/NextUIProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
export const metadata: Metadata = {
  title: "Food Delivery",
  description: "Food Delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable}`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "/components/Navbar"
import Footer from "/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GeoGrade",
  description: "Find your spot and become an academic weapon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

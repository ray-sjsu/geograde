import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "/components/Navbar";
import Footer from "/components/Footer";
import { CoordinatesProvider } from "/components/CoordinatesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GeoGrade",
  description: "Find your spot and become an academic weapon",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add global meta tags or styles */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <CoordinatesProvider>
          <Navbar />
          {children}
          <Footer />
        </CoordinatesProvider>
      </body>
    </html>
  );
}

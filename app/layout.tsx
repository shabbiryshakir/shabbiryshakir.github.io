import { Inter } from "next/font/google";
import "./globals.css";

// Load Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shabbir Shakir | Workspace",
  description: "Futuristic OS Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome CDN for your icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      {/* inter.className applies the Apple-style font globally without needing Tailwind config */}
      <body className={`${inter.className} antialiased selection:bg-blue-500/30`}>
        {children}
      </body>
    </html>
  );
}
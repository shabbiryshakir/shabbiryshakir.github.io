import { Inter } from "next/font/google";
import "./globals.css";

// Load Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://shabbiryshakir.github.io"),
  title: "Shabbir Shakir | Workspace",
  description:
    "Futuristic OS-style portfolio of Shabbir Shakir — System Architect, teacher, and developer. Explore projects, designs, and writing in an interactive workspace.",
  openGraph: {
    title: "Shabbir Shakir | Workspace",
    description:
      "Futuristic OS-style portfolio of Shabbir Shakir — System Architect, teacher, and developer.",
    url: "https://shabbiryshakir.github.io",
    siteName: "Shabbir Shakir",
    images: [{ url: "/profile.jpg", width: 1200, height: 1200, alt: "Shabbir Shakir" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shabbir Shakir | Workspace",
    description:
      "Futuristic OS-style portfolio of Shabbir Shakir — System Architect, teacher, and developer.",
    images: ["/profile.jpg"],
  },
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
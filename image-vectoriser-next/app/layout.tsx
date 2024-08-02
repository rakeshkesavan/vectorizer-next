// app/layout.tsx
import '../styles/globals.css';
import { Inter as FontSans } from "next/font/google"
// If shadcn-ui requires any specific CSS file, import it here
// import '@shadcn/ui/dist/index.css';
import { cn } from "@/lib/utils"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body  className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>{children}</body>
    </html>
  );
}

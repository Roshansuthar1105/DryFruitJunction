import "./globals.css"
import Header from "../components/header"
import Footer from "../components/footer"

export const metadata = {
  title: "DryFruit Junction - Local Artisan Sweets",
  description: "Handcrafted sweets and confections made with love in your local community",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

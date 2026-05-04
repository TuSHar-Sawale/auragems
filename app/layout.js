'use client'

import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AuraGems - Premium Handmade Jewelry</title>
        <meta
          name="description"
          content="Discover exquisite handmade jewelry at AuraGems. Premium quality gemstones and artisanal designs."
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card-bg border-t border-border-dark mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif text-gradient mb-4">✦ AuraGems</h3>
            <p className="text-text-light text-sm">
              Discover premium handmade jewelry crafted with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-text-light hover:text-primary">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-light hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-light hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-light hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-primary font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-text-light hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-light hover:text-primary">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-light hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-light hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary font-semibold mb-4">Contact</h4>
            <p className="text-text-light text-sm mb-2">Email: support@auragems.com</p>
            <p className="text-text-light text-sm mb-4">Phone: +91 9876543210</p>
            <div className="flex gap-4">
              <a href="#" className="text-primary hover:text-yellow-400">📘</a>
              <a href="#" className="text-primary hover:text-yellow-400">📷</a>
              <a href="#" className="text-primary hover:text-yellow-400">𝕏</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-dark pt-8">
          <p className="text-center text-text-light text-sm">
            &copy; {currentYear} AuraGems. All rights reserved. | Crafted with ✨ and ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}

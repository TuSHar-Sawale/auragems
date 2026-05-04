'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/helpers'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="card flex gap-4">
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-border-dark">
        {item.images?.[0]?.image_url ? (
          <Image
            src={item.images[0].image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-text-light mb-2">{item.name}</h3>
        <p className="text-primary font-bold mb-2">{formatCurrency(item.price)}</p>

        {/* Quantity Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-border-dark rounded hover:bg-primary text-text-light hover:text-black"
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
            className="w-12 text-center input-field"
          />
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-border-dark rounded hover:bg-primary text-text-light hover:text-black"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal & Remove */}
      <div className="text-right">
        <p className="text-2xl font-bold text-primary mb-2">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="btn-danger text-xs"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

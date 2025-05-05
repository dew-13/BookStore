"use client"

import Link from "next/link"
import { useState } from "react"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [couponCode, setCouponCode] = useState("")

  const shippingCost = 300
  const total = subtotal + shippingCost

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="mt-4">
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="p-6">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-medium">Items ({items.length})</h2>
                <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear cart
                </Button>
              </div>
              <Separator />
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-6">
                    <div className="flex items-start gap-4">
                      <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">
                              <Link href={`/books/${item.id}`} className="hover:underline">
                                {item.title}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">LKR {item.price.toFixed(2)}</p>
                          </div>
                          <p className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <button
                              type="button"
                              className="p-2"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 text-center w-8">{item.quantity}</span>
                            <button
                              type="button"
                              className="p-2"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-medium text-primary hover:text-primary/80"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>LKR {shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={user ? "/checkout" : "/login?redirect=/checkout"}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <ReceiptText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Satisfaction Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">30-day money-back guarantee if you're not satisfied.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

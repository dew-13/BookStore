"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, CreditCard, ChevronRight, ArrowLeft, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState("shipping")
  const [isProcessing, setIsProcessing] = useState(false)

  const shippingCost = 300
  const total = subtotal + shippingCost

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.username || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sri Lanka",
    email: user?.email || "",
    phone: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
    saveCard: false,
  })

  const [paymentMethod, setPaymentMethod] = useState("card")

  const [shippingMethod, setShippingMethod] = useState("standard")

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate shipping info
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.email
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    setActiveStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate payment info
    if (paymentMethod === "card") {
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvc) {
        toast({
          title: "Missing information",
          description: "Please fill in all payment details",
          variant: "destructive",
        })
        return
      }
    }
    setActiveStep("review")
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Create order in database
      if (!user) {
        toast({
          title: "User not logged in",
          description: "Please log in to place an order",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          totalAmount: total,
          items: items.map((item) => ({
            bookId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          paymentMethod: paymentMethod,  // Added paymentMethod
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      // Clear cart and redirect to confirmation
      clearCart()
      router.push("/checkout/confirmation")

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error processing order",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" disabled={activeStep !== "shipping"}>
                <div className="flex items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border mr-2">
                    {activeStep === "shipping" ? "1" : <Check className="h-4 w-4" />}
                  </div>
                  Shipping
                </div>
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeStep !== "payment" && activeStep !== "review"}>
                <div className="flex items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border mr-2">
                    {activeStep === "payment" ? "2" : activeStep === "review" ? <Check className="h-4 w-4" /> : "2"}
                  </div>
                  Payment
                </div>
              </TabsTrigger>
              <TabsTrigger value="review" disabled={activeStep !== "review"}>
                <div className="flex items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border mr-2">3</div>
                  Review
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <form onSubmit={handleShippingSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" name="phone" value={shippingInfo.phone} onChange={handleShippingInfoChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Shipping Method</Label>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Standard Shipping</p>
                                <p className="text-sm text-muted-foreground">Delivery in 3-5 business days</p>
                              </div>
                              <p className="font-medium">LKR 300</p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium">Express Shipping</p>
                                <p className="text-sm text-muted-foreground">Delivery in 1-2 business days</p>
                              </div>
                              <p className="font-medium">LKR 500</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Continue to Payment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <form onSubmit={handlePaymentSubmit}>
                  <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Card</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        required={paymentMethod === "card"}
                        disabled={paymentMethod === "cod"}
                      />
                      <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                    <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentInfoChange}
                      required={paymentMethod === "card"}
                      disabled={paymentMethod === "cod"}
                    />
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentInfoChange}
                          required={paymentMethod === "card"}
                          disabled={paymentMethod === "cod"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={paymentInfo.cvc}
                          onChange={handlePaymentInfoChange}
                          required={paymentMethod === "card"}
                          disabled={paymentMethod === "cod"}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={paymentInfo.saveCard}
                        onChange={() => setPaymentInfo((prev) => ({ ...prev, saveCard: !prev.saveCard }))}
                      />
                      <Label htmlFor="saveCard" className="text-sm">
                        Save card for future purchases
                      </Label>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Your payment information is secure and encrypted
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => setActiveStep("shipping")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Review Order
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <div className="rounded-md border p-4 text-sm">
                      <p className="font-medium">{shippingInfo.fullName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                      <p>{shippingInfo.country}</p>
                      <p className="mt-2">{shippingInfo.email}</p>
                      {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="rounded-md border p-4 text-sm">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        {paymentMethod === "cod" ? (
                          <p>Cash on Delivery (COD)</p>
                        ) : (
                          <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    <div className="rounded-md border p-4 text-sm">
                      <div className="flex items-center">
                        <Truck className="mr-2 h-5 w-5" />
                        <div>
                          <p className="font-medium">
                            {shippingMethod === "standard" ? "Standard Shipping" : "Express Shipping"}
                          </p>
                          <p className="text-muted-foreground">
                            {shippingMethod === "standard"
                              ? "Delivery in 3-5 business days"
                              : "Delivery in 1-2 business days"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="rounded-md border divide-y">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center p-4 gap-4">
                          <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
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
                          <div className="flex flex-1 justify-between">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveStep("payment")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>LKR {shippingMethod === "standard" ? "300" : "500"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Checkout</h3>
                    <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure.</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

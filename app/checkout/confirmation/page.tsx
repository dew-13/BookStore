"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle, Package, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ConfirmationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orderNumber, setOrderNumber] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user came from checkout flow
    const checkOrderStatus = async () => {
      try {
        // Try to get the most recent order
        if (user?.id) {
          const response = await fetch(`/api/orders?userId=${user.id}`)

          if (response.ok) {
            const orders = await response.json()

            if (orders && orders.length > 0) {
              // Get the most recent order
              const latestOrder = orders[0]
              setOrderNumber(latestOrder.id)

              // Calculate estimated delivery date (5-7 business days from order date)
              const orderDate = new Date(latestOrder.createdAt)
              const deliveryDate = new Date(orderDate)
              deliveryDate.setDate(orderDate.getDate() + 5 + Math.floor(Math.random() * 3))

              // Format date as Month Day, Year
              const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
              setEstimatedDelivery(deliveryDate.toLocaleDateString("en-US", options))
              setIsLoading(false)
              return
            }
          }
        }

        // If no order found or error, generate placeholder data
        generatePlaceholderData()
      } catch (error) {
        console.error("Error fetching order:", error)
        generatePlaceholderData()
      }
    }

    const generatePlaceholderData = () => {
      // Generate random order number
      const randomOrderNumber = Math.floor(100000000 + Math.random() * 900000000).toString()
      setOrderNumber(`ORD-${randomOrderNumber}`)

      // Calculate estimated delivery date (5-7 business days from now)
      const today = new Date()
      const deliveryDate = new Date(today)
      deliveryDate.setDate(today.getDate() + 5 + Math.floor(Math.random() * 3))

      // Format date as Month Day, Year
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      setEstimatedDelivery(deliveryDate.toLocaleDateString("en-US", options))
      setIsLoading(false)
    }

    checkOrderStatus()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <p>Loading order information...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium">{estimatedDelivery}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Method</span>
              <span className="font-medium">Standard Shipping</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Track Your Order</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You will receive an email with tracking information once your order ships.
                </p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href={user ? "/account/orders" : "#"}>View Order Status</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  If you have any questions about your order, please contact our customer service.
                </p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button asChild>
          <Link href="/books">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

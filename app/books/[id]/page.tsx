"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ShoppingCart, BookOpen, BadgeInfo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"

type BookDetails = {
  id: string
  title: string
  authors: string[]
  publishedDate: string
  description: string
  thumbnail: string
  categories: string[]
  pageCount: number
  price: number
  publisher: string
  isbn: string
  inStock: boolean
}

export default function BookDetailsPage() {
  const params = useParams()
  const [book, setBook] = useState<BookDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchBookDetails() {
      if (!params.id) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/books/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch book details")
        }

        const data = await response.json()
        setBook(data)
      } catch (error) {
        console.error("Error fetching book details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookDetails()
  }, [params.id])

  const handleAddToCart = () => {
    if (!book) return

    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      thumbnail: book.thumbnail,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/books" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to books
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Skeleton className="aspect-[2/3] w-full" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/books" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to books
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Book not found</h2>
          <p className="text-muted-foreground">The book you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/books" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to books
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="aspect-[2/3] relative bg-muted rounded-md overflow-hidden">
            {book.thumbnail ? (
              <img src={book.thumbnail || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl mb-2">{book.authors?.join(", ") || "Unknown author"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories?.map((category, index) => (
              <Badge key={index} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {book.publishedDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{book.publishedDate}</span>
              </div>
            )}
            {book.pageCount > 0 && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{book.pageCount} pages</span>
              </div>
            )}
            {book.publisher && (
              <div className="flex items-center">
                <BadgeInfo className="h-4 w-4 mr-1" />
                <span>{book.publisher}</span>
              </div>
            )}
          </div>
          <div
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: book.description || "No description available." }}
          />
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold">${book.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{book.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={!book.inStock} className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
          {book.isbn && <p className="text-sm text-muted-foreground mt-4">ISBN: {book.isbn}</p>}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        {/* This would be a BookGrid component with related books */}
      </div>
    </div>
  )
}

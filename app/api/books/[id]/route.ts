import { type NextRequest, NextResponse } from "next/server"

// Google Books API endpoint
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

// In-memory cache for book prices by book id
const priceCache = new Map<string, number>()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: bookId } = await params

    // Check if price is cached for this book
    if (priceCache.has(bookId)) {
      const cachedPrice = priceCache.get(bookId)!
      // Fetch book details from Google Books API
      const response = await fetch(`${GOOGLE_BOOKS_API}/${bookId}`)

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: "Book not found" }, { status: 404 })
        }
        throw new Error("Failed to fetch book details from Google Books API")
      }

      const data = await response.json()
      // Format book data with cached price
      const bookDetails = formatBookDetailsData(data, cachedPrice)
      return NextResponse.json(bookDetails)
    }

    // Fetch book details from Google Books API
    const response = await fetch(`${GOOGLE_BOOKS_API}/${bookId}`)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
      }
      throw new Error("Failed to fetch book details from Google Books API")
    }

    const data = await response.json()

    // Format book data and cache price
    const bookDetails = formatBookDetailsData(data)
    priceCache.set(bookId, bookDetails.price)
    return NextResponse.json(bookDetails)
  } catch (error) {
    console.error("Error fetching book details:", error)
    return NextResponse.json({ error: "Failed to fetch book details" }, { status: 500 })
  }
}

// Helper function to format book details data
function formatBookDetailsData(item: any, cachedPrice?: number) {
  const volumeInfo = item.volumeInfo || {}
  const saleInfo = item.saleInfo || {}

  // Use cached price if available, else convert available price to LKR or assign fixed default price
  const price = cachedPrice !== undefined
    ? cachedPrice
    : saleInfo.retailPrice?.amount
      ? saleInfo.retailPrice.amount * 300
      : 2000

  return {
    id: item.id,
    title: volumeInfo.title || "Unknown Title",
    authors: volumeInfo.authors || [],
    publishedDate: volumeInfo.publishedDate || "",
    description: volumeInfo.description || "",
    thumbnail: volumeInfo.imageLinks?.thumbnail || "",
    categories: volumeInfo.categories || [],
    pageCount: volumeInfo.pageCount || 0,
    publisher: volumeInfo.publisher || "",
    isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || "",
    price,
    inStock: true, // Assuming all books are in stock for this example
  }
}

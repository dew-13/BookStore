import { type NextRequest, NextResponse } from "next/server"

// Google Books API endpoint
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "40")
    const sort = searchParams.get("sort") || "relevance"

    // Determine orderBy parameter for Google Books API
    let orderBy = "relevance"
    if (sort === "relevance" || sort === "newest") {
      orderBy = sort
    }

    // If no query, return some popular books
    if (!query) {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=${orderBy}&maxResults=40`)

      if (!response.ok) {
        throw new Error("Failed to fetch books from Google Books API")
      }

      const data = await response.json()

      let books = data.items?.map(formatBookData).slice(0, limit) || []

      // Manual sorting for title, author, price
      books = sortBooks(books, sort)

      return NextResponse.json(books)
    }

    // Fetch books based on the query
    const params = new URLSearchParams()
    params.append("q", query)
    params.append("orderBy", orderBy)
    params.append("maxResults", "40")

    const response = await fetch(`${GOOGLE_BOOKS_API}?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch books from Google Books API")
    }

    const data = await response.json()

    let books = data.items?.map(formatBookData).slice(0, limit) || []

    // Manual sorting for title, author, price
    books = sortBooks(books, sort)

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

// Helper function to sort books manually
function sortBooks(books: any[], sort: string) {
  switch (sort) {
    case "title":
      return books.sort((a, b) => {
        const firstWordA = a.title.split(" ")[0].toLowerCase()
        const firstWordB = b.title.split(" ")[0].toLowerCase()
        return firstWordA.localeCompare(firstWordB, undefined, { sensitivity: 'base' })
      })
    case "author":
      return books.sort((a, b) => {
        const authorA = (a.authors && a.authors.length > 0) ? a.authors[0].split(" ")[0].toLowerCase() : ""
        const authorB = (b.authors && b.authors.length > 0) ? b.authors[0].split(" ")[0].toLowerCase() : ""
        return authorA.localeCompare(authorB, undefined, { sensitivity: 'base' })
      })
    case "price-low":
      return books.sort((a, b) => a.price - b.price)
    case "price-high":
      return books.sort((a, b) => b.price - a.price)
    default:
      return books
  }
}

// In-memory cache for book prices by book id
const priceCache = new Map<string, number>()

// Helper function to format book data
function formatBookData(item: any) {
  const volumeInfo = item.volumeInfo || {}
  const saleInfo = item.saleInfo || {}

  // Check if price is cached for this book
  if (priceCache.has(item.id)) {
    return {
      id: item.id,
      title: volumeInfo.title || "Unknown Title",
      authors: volumeInfo.authors || [],
      publishedDate: volumeInfo.publishedDate || "",
      description: volumeInfo.description || "",
      thumbnail: volumeInfo.imageLinks?.thumbnail || "",
      price: priceCache.get(item.id)!,
    }
  }

  // Convert available price to LKR by multiplying by 300, else assign fixed default price of 2000 LKR
  const price = saleInfo.retailPrice?.amount ? saleInfo.retailPrice.amount * 300 : 2000

  // Cache the price
  priceCache.set(item.id, price)

  return {
    id: item.id,
    title: volumeInfo.title || "Unknown Title",
    authors: volumeInfo.authors || [],
    publishedDate: volumeInfo.publishedDate || "",
    description: volumeInfo.description || "",
    thumbnail: volumeInfo.imageLinks?.thumbnail || "",
    price,
  }
}

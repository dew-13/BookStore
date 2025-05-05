import { NextResponse } from "next/server"

// Google Books API endpoint
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

export async function GET() {
  try {
    // Fetch specific famous books by title
    const famousTitles = ["It Ends With Us", "Pride and Prejudice", "Rich Dad Poor Dad", "Ikigai",  "Welcome Home", "Diary of a Wimpy Kid", "The Great Gatsby" , "The Witcher", "The Da Vinci Code"]
    const famousBooksPromises = famousTitles.map(async (title) => {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=intitle:${encodeURIComponent(title)}&orderBy=newest&maxResults=1`)
      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${title}`)
      }
      const data = await response.json()
      return data.items?.map(formatBookData).slice(0, 1)[0]
    })
    const famousBooks = (await Promise.all(famousBooksPromises)).filter(Boolean)

    // Fetch latest English fiction books excluding Tamil, limit to 6 to keep total 8 books
    const fictionResponse = await fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction+-subject:tamil+language:en&orderBy=newest&maxResults=6`)
    if (!fictionResponse.ok) {
      throw new Error("Failed to fetch featured books from Google Books API")
    }
    const fictionData = await fictionResponse.json()
    const fictionBooks = fictionData.items?.map(formatBookData).slice(0, 6) || []

    // Combine famous books with fiction books
    const featuredBooks = [...famousBooks, ...fictionBooks]

    return NextResponse.json(featuredBooks)
  } catch (error) {
    console.error("Error fetching featured books:", error)
    return NextResponse.json({ error: "Failed to fetch featured books" }, { status: 500 })
  }
}

// Helper function to format book data
function formatBookData(item: any) {
  const volumeInfo = item.volumeInfo || {}
  const saleInfo = item.saleInfo || {}

  // Generate a random rounded price between 1500 and 2500 LKR if not available
  const minPrice = 1500
  const maxPrice = 2500
  const step = 250
  const randomSteps = Math.floor(Math.random() * ((maxPrice - minPrice) / step + 1))
  const price = saleInfo.retailPrice?.amount || minPrice + randomSteps * step

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

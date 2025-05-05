"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { BookSearch } from "@/components/book-search"
import { BookGrid } from "@/components/book-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BooksPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:max-w-md">
            <BookSearch />
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Search results for &quot;{query}&quot;</h2>
        </div>
      )}

      <BookGrid query={query} sortBy={sortBy} />
    </div>
  )
}

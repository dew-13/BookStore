import Link from "next/link"
import { BookSearch } from "@/components/book-search"
import { BookGrid } from "@/components/book-grid"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container px-4 mx-auto py-6">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to your online Book Store</h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover your next favorite book from our extensive collection.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <BookSearch />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Books</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Explore our handpicked selection of best-selling books.
              </p>
            </div>
            <Link href="/books">
              <Button variant="outline">View All Books</Button>
            </Link>
          </div>
          <div className="mt-8">
            <BookGrid featured={true} limit={8} />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Fast Delivery</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get your books delivered to your doorstep within 24 hours.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Special Discounts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enjoy exclusive discounts on selected books every week.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Secure Payments</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All transactions are processed securely through our payment gateway.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Customer Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our team is available 24/7 to assist you with any queries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

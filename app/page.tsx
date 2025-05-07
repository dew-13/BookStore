'use client'

import Link from "next/link"
import { BookSearch } from "@/components/book-search"
import { BookGrid } from "@/components/book-grid"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section with Background Image */}
      <section
        className="relative bg-cover bg-center py-24 px-4 md:px-8 lg:px-16"
        style={{
          backgroundImage: "url('/cover.jpg')", // Ensure this path matches your image location
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center space-y-6 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Welcome to your <span className="text-primary">Online Book Store</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-200">
            Discover the book you need from our book collection.
          </p>
          <div className="max-w-md mx-auto">
            <BookSearch />
          </div>
        </motion.div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Top Picks</h2>
           
            </div>
            <Link href="/books">
              <Button variant="outline">View All Books</Button>
            </Link>
          </div>
          <BookGrid featured={true} limit={8} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 px-4 md:px-8 lg:px-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-white dark:bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center space-y-4"
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "Fast Delivery",
    description: "Get your books delivered within 24 hours, straight to your doorstep.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    ),
  },
  {
    title: "Special Discounts",
    description: "Enjoy weekly deals and exclusive discounts on top titles.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "All transactions are encrypted and processed securely.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "We’re here for you at any hour via chat or email.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X, User, UserCircle, ClipboardList, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { items } = useCart()

  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Explore",
      path: "/books",
    },

  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">BookStore</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={
                  pathname === route.path
                    ? "text-foreground font-bold"
                    : "text-foreground/60 transition-colors hover:text-foreground"
                }
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" asChild className="mr-2">
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {items.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2">
                    {items.length}
                  </span>
                )}
              </Link>
            </Button>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-gray-300 rounded-full">
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
                  <DropdownMenuItem className="font-normal flex items-center space-x-2 rounded-md p-2">
                    <UserCircle className="w-5 h-5" />
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 hover:border hover:border-gray-300 rounded-md p-2">
                    <Link href="/profile" className="w-full flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2 hover:border hover:border-gray-300 rounded-md p-2">
                    <Link href="/orders" className="w-full flex items-center space-x-2">
                      <ClipboardList className="w-5 h-5" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 hover:border hover:border-gray-300 rounded-md p-2 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-1">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <button
            className="md:hidden rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={
                  pathname === route.path
                    ? "text-foreground font-bold"
                    : "text-foreground/60 transition-colors hover:text-foreground"
                }
                onClick={toggleMenu}
              >
                {route.name}
              </Link>
            ))}
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="text-foreground/60 transition-colors hover:text-foreground"
                  onClick={toggleMenu}
                >
                  Orders
                </Link>
                <button
                  className="text-left text-foreground/60 transition-colors hover:text-foreground"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                >
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

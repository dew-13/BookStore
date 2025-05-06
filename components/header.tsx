"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Menu,
  X,
  User,
  UserCircle,
  ClipboardList,
  LogOut,
  Home,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import clsx from "clsx"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { items } = useCart()

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Explore", path: "/books", icon: Search },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={clsx(
      "sticky top-0 z-50 w-full border-b bg-background transition-shadow",
      { "shadow-md": isScrolled }
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="BookStore Logo" className="h-6 w-6 object-contain" />
          <span className="font-bold text-xl">BookStore</span>
        </Link>

        {/* Right-side icons */}
        <div className="flex items-center gap-x-4">
          <div className="hidden md:flex items-center gap-x-4">
            {routes.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                href={path}
                className={clsx(
                  "transition-colors hover:text-primary",
                  pathname === path ? "text-primary font-bold" : "text-foreground/60"
                )}
              >
                <Icon className="h-5 w-5 transition-transform hover:scale-110" />
              </Link>
            ))}
          </div>

          <Button variant="ghost" asChild className="relative p-0 hover:bg-transparent">
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6 transition-transform hover:scale-110" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-2 rounded-full bg-primary text-primary-foreground text-xs px-2">
                  {items.length}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-transparent">
                  <Avatar className="h-8 w-8 border border-gray-300">
                    <AvatarFallback>
                      <User className="h-6 w-6 transition-transform hover:scale-110" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
                <DropdownMenuItem className="font-normal flex items-center space-x-2 p-2">
                  <UserCircle className="w-5 h-5" />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center space-x-2 w-full">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders" className="flex items-center space-x-2 w-full">
                    <ClipboardList className="w-5 h-5" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 cursor-pointer">
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

          {/* Mobile Drawer Toggle */}
          <button
            className="md:hidden transition-transform hover:scale-110"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={toggleMenu}
      >
        <div
          className={clsx(
            "absolute top-0 left-0 h-full w-64 bg-background p-6 shadow-xl transform transition-transform",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col space-y-4">
            {routes.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                onClick={toggleMenu}
                className={clsx(
                  "text-base transition-colors hover:text-primary",
                  pathname === path ? "text-primary font-bold" : "text-foreground/60"
                )}
              >
                {name}
              </Link>
            ))}
            {!user ? (
              <>
                <Link href="/login" onClick={toggleMenu} className="text-foreground/60 hover:text-primary">
                  Login
                </Link>
                <Link href="/signup" onClick={toggleMenu} className="text-foreground/60 hover:text-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" onClick={toggleMenu} className="text-foreground/60 hover:text-primary">
                  Profile
                </Link>
                <Link href="/orders" onClick={toggleMenu} className="text-foreground/60 hover:text-primary">
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="text-left text-foreground/60 hover:text-primary"
                >
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

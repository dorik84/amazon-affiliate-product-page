"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold ">
            BestChoice
          </Link>
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-8">
              {/* <Link href="/electronics" className="text-gray-600 hover:text-gray-800">
                Electronics
              </Link>
              <Link href="/home-garden" className="text-gray-600 hover:text-gray-800">
                Home & Garden
              </Link>
              <Link href="/fashion" className="text-gray-600 hover:text-gray-800">
                Fashion
              </Link>
              <Link href="/toys" className="text-gray-600 hover:text-gray-800">
                Toys & Games
              </Link> */}
            </div>
            <div className="flex items-center space-x-4 ml-4">
              {/* <button aria-label="Search" className="text-gray-600 hover:text-gray-800">
                <Search size={20} />
              </button>
              <button aria-label="User account" className="text-gray-600 hover:text-gray-800">
                <User size={20} />
              </button>
              <button aria-label="Shopping cart" className="text-gray-600 hover:text-gray-800">
                <ShoppingCart size={20} />
              </button>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button> */}
            </div>
          </div>
        </div>
        {/* {isMenuOpen && (
          <nav className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              <Link href="/electronics" className="text-gray-600 hover:text-gray-800 py-2">
                Electronics
              </Link>
              <Link href="/home-garden" className="text-gray-600 hover:text-gray-800 py-2">
                Home & Garden
              </Link>
              <Link href="/fashion" className="text-gray-600 hover:text-gray-800 py-2">
                Fashion
              </Link>
              <Link href="/toys" className="text-gray-600 hover:text-gray-800 py-2">
                Toys & Games
              </Link>
            </div>
          </nav>
        )} */}
      </div>
    </header>
  );
}

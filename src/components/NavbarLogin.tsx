"use client";

// Import necessary modules for the login navbar
import Link from "next/link";
import { useState } from "react";
import {
    Bars3Icon,
    XMarkIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from "@headlessui/react";
import Image from "next/image";

export default function NavbarLogin() {
    // Navigation items for non-authenticated users
    const navigation = [
        { name: "Home", href: "/", current: false },
        { name: "Courses", href: "/course", current: false },
        { name: "Contact", href: "/contact", current: false }
    ];

    // State for search functionality
    const [searchQuery, setSearchQuery] = useState("");

    // Function to handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality here
        console.log("Searching for:", searchQuery);
        // You can add your search logic here, such as:
        // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    };

    return (
        <Disclosure
            as="nav"
            className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="block size-6 group-data-[open]:hidden"
                            />
                            <XMarkIcon
                                aria-hidden="true"
                                className="hidden size-6 group-data-[open]:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <Image
                                    alt="Logo"
                                    src="https://cloud-api.hamzzz.my.id/file/UDlfFzpuVr.png"
                                    className="h-8 w-auto"
                                    width={32}
                                    height={32}
                                    priority
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map(item => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                      ${
                          item.current
                              ? "bg-gray-950/50 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }
                      rounded-md px-3 py-2 text-sm font-bold
                    `}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Search form container */}
                        <form onSubmit={handleSearch} className="relative mr-4">
                            {/* Search icon container - positioned inside the input field */}
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* Magnifying glass icon for search */}
                                <MagnifyingGlassIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            {/* Search input field with state binding */}
                            <input
                                type="text" // Text input type
                                value={searchQuery} // Controlled input bound to state
                                onChange={e => setSearchQuery(e.target.value)} // Update state on change
                                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Search..." // Placeholder text
                            />
                        </form>

                        {/* Login buttons for non-authenticated users */}
                        <div className="flex space-x-2">
                            <Link
                                href="/login"
                                className="font-bold px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition duration-300"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map(item => (
                        <DisclosureButton
                            key={item.name}
                            as={Link}
                            href={item.href}
                            className={`
                ${
                    item.current
                        ? "bg-gray-950/50 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                }
                block rounded-md px-3 py-2 text-base font-medium
              `}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                    {/* Search form in mobile view */}
                    <div className="pt-2 pb-2 border-t border-gray-700">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Search..."
                            />
                        </form>
                    </div>
                    <div className="pt-2 pb-2 border-t border-gray-700 flex flex-col space-y-2">
                        <Link
                            href="/login"
                            className="font-bold px-4 py-2 text-gray-300 font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition duration-300 text-center"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}

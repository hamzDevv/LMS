"use client";

// Import necessary modules for the authenticated navbar
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/actions/auth-action";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Image from "next/image";

// Define the user type with role
type User = {
  id: number;
  email: string;
  role: "ADMIN" | "TEACHER" | "USER";
};

// Define the props for the Navbar component
interface NavbarProps {
  user: User;
}

// Function to get navigation items based on user role
const getNavigationItems = (role: string) => {
  const baseItems = [{ name: "Dashboard", href: "/dashboard", current: false }];

  // Add role-specific items
  switch (role) {
    case "ADMIN":
      return [
        ...baseItems,
        { name: "Admin Panel", href: "./app/admin", current: false },
        { name: "User Management", href: "./admin/users", current: false },
        {
          name: "Course Management",
          href: "./app/admin/courses",
          current: false,
        },
      ];
    case "TEACHER":
      return [
        ...baseItems,
        { name: "My Courses", href: "./app/teacher/courses", current: false },
        {
          name: "Create Course",
          href: "/teacher/create-course",
          current: false,
        },
      ];
    case "USER":
    default:
      return [
        ...baseItems,
        { name: "My Courses", href: "./app/user/courses", current: false },
        { name: "My Profile", href: "./app/user/profile", current: false },
      ];
  }
};

// Function to get profile menu items based on role
const getProfileMenuItems = (role: string) => {
  switch (role) {
    case "ADMIN":
      return [
        { name: "Your Profile", href: "./app/admin/profile" },
      ];
    case "TEACHER":
      return [
        { name: "Your Profile", href: "./app/teacher/profile" },
      ];
    case "USER":
    default:
      return [
        { name: "Your Profile", href: "./app/user/profile" },
      ];
  }
};

export default function Navbar({ user }: NavbarProps) {
  // Get current path to determine active navigation item
  const pathname = usePathname();

  // Get navigation items based on user role
  const navigation = getNavigationItems(user.role);

  // Get profile menu items based on user role
  const profileMenuItems = getProfileMenuItems(user.role);

  // Update navigation items to mark current page
  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }));

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
              <Image
                alt="Your Company"
                src="https://cloud-api.hamzzz.my.id/file/UDlfFzpuVr.png"
                className="h-8 w-auto"
                width={32}
                height={32}
                priority
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {updatedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      ${
                        item.current
                          ? "bg-gray-950/50 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }
                      rounded-md px-3 py-2 text-sm font-medium
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
                onChange={(e) => setSearchQuery(e.target.value)} // Update state on change
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search..." // Placeholder text
              />
            </form>

            {/* Notification button */}
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <Image
                  alt="User profile"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.email
                  )}&background=random`}
                  className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  width={32}
                  height={32}
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
              >
                {profileMenuItems.map((item) => (
                  <MenuItem key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-300 data-[focus]:bg-white/5"
                    >
                      {item.name}
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem>
                  <form action={handleLogout}>
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-[focus]:bg-white/5 hover:bg-white/5"
                    >
                      Sign out
                    </button>
                  </form>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {updatedNavigation.map((item) => (
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
          <DisclosureButton
            as="div"
            className="pt-4 pb-2 border-t border-gray-700"
          >
            <form action={handleLogout}>
              <button
                type="submit"
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-md"
              >
                Sign out
              </button>
            </form>
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

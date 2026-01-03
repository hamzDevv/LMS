// Import necessary modules for the navigation component
import NavbarLogin from "./NavbarLogin";
import NavbarAuth from "./NavbarAuth";
import { getAuthenticatedUser } from "@/utils/auth";

// Server component that renders the appropriate navbar based on authentication status
export default async function Navigation() {
  // Get the authenticated user
  const user = await getAuthenticatedUser();

  // Render the appropriate navbar based on authentication status
  if (user) {
    // If user is authenticated, render the authenticated navbar with user data
    return <NavbarAuth user={user} />;
  } else {
    // If user is not authenticated, render the login navbar
    return <NavbarLogin />;
  }
}

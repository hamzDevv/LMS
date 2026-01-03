"use server";

// Import necessary modules for authentication actions
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendEmail } from "@/utils/sendEmail";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Handles user registration by validating input, checking for existing users,
 * hashing the password, and creating a new user in the database.
 * @param formData - Form data containing email and password
 * @returns Object with error message if registration fails
 */
export async function handleRegister(formData: FormData) {
  // Extract email and password from form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validate password confirmation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Validate password length
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  // Check if email already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already registered" };
  }

  // Hash the password before storing it in the database
  const hashedPassword = await hash(password, 12);

  // Create a new user in the database
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Redirect to login page after successful registration
  redirect("/login");
}

/**
 * Handles user login by validating credentials, creating a JWT token,
 * and setting it as an HTTP-only cookie.
 * @param formData - Form data containing email and password
 * @returns Object with error message if login fails
 */
export async function handleLogin(formData: FormData) {
  // Extract email and password from form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Find user by email in the database
  const user = await prisma.user.findUnique({ where: { email } });

  // Check if user exists and password is correct
  if (!user || !(await compare(password, user.password))) {
    return { error: "Invalid credentials" };
  }

  // Create JWT token with user ID and expiration time
  const token = sign(
    { userId: user.id },
    process.env.JWT_SECRET || "fallback-secret-key",
    { expiresIn: "7d" }
  );

  // Set the token as an HTTP-only cookie for security
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    sameSite: "strict", // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // Redirect to role-specific folder after successful login
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else if (user.role === "TEACHER") {
    redirect("/teacher");
  } else {
    redirect("/user");
  }
}

/**
 * Handles user logout by deleting the authentication cookie and redirecting to login.
 */
export async function handleLogout() {
  // Delete the authentication cookie
  const cookieStore = await cookies();
  cookieStore.delete("token");

  // Redirect to login page
  redirect("/login");
}

/**
 * Handles password reset by validating the token, hashing the new password,
 * and updating the user's password in the database.
 * @param token - Reset token from the password reset link
 * @param password - New password to set
 * @returns Object with success or error message
 */
export async function handleResetPassword(
  token: string | null,
  password: string
) {
  // Check if token is provided
  if (!token) {
    return { message: "Invalid or expired token." };
  }

  try {
    // Verify the reset token using the JWT secret
    const payload = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as { userId: number };
    const userId = payload.userId;

    // Check if the token exists in the database and hasn't been used
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.resetToken !== token || user.resetTokenUsed) {
      return { message: "Invalid or expired token." };
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update the user's password, mark token as used, and clear the reset token
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetTokenUsed: true, // Mark token as used to prevent reuse
        resetToken: null, // Clear the reset token
      },
    });

    return { message: "Password reset successful." };
  } catch (error) {
    console.error("Password reset error:", error);
    return { message: "Invalid or expired token." };
  }
}

/**
 * Handles forgot password request by generating a reset token and sending it via email.
 * @param email - Email address of the user requesting password reset
 * @returns Object with success or error message
 */
export async function handleForgotPassword(email: string) {
  // Check if the email exists in the database
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Return generic message to prevent email enumeration attacks
    return {
      message: "If the email is registered, you will receive a reset link.",
    };
  }

  // Generate a reset token that expires in 1 hour
  const resetToken = sign(
    { userId: user.id },
    process.env.JWT_SECRET || "fallback-secret-key",
    { expiresIn: "1h" }
  );

  // Save the reset token in the database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenUsed: false, // Reset token is not used yet
    },
  });

  // Create the reset password link
  const resetLink = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;

  // Send password reset email to the user
  try {
    await sendEmail(
      email,
      "Reset Your Password",
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    );
  } catch (emailError) {
    console.error("Failed to send reset email:", emailError);
    return { message: "Failed to send reset email. Please try again later." };
  }

  return {
    message: "If the email is registered, you will receive a reset link.",
  };
}

/**
 * Validates a reset token to check if it's valid and hasn't been used.
 * @param token - Reset token to validate
 * @returns Object with validation result and user ID if valid
 */
export async function validateResetToken(token: string) {
  try {
    // Verify the token using the JWT secret
    const payload = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as { userId: number };
    const userId = payload.userId;

    // Check if the token exists in the database and hasn't been used
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Validate that the token matches and hasn't been used
    if (!user || user.resetToken !== token || user.resetTokenUsed) {
      return { valid: false, message: "Invalid or expired token." };
    }

    return { valid: true, userId: user.id };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false, message: "Invalid or expired token." };
  }
}

// Import nodemailer for sending emails
import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP server host
  port: parseInt(process.env.SMTP_PORT || "587"), // SMTP server port (default: 587)
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password or app password
  },
});

/**
 * Sends an email using the configured transporter
 * @param to - Recipient's email address
 * @param subject - Email subject line
 * @param html - HTML content of the email
 * @returns Promise that resolves when the email is sent
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Send the email with the provided parameters
    const info = await transporter.sendMail({
      from: `"LMS App" <${process.env.SMTP_FROM || "noreply@yourapp.com"}>`, // Sender address
      to, // Recipient's email address
      subject, // Email subject
      html, // HTML body of the email
    });

    // Log the message ID for debugging purposes
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    // Log any errors that occur during email sending
    console.error("Error sending email:", error);
    throw error;
  }
}

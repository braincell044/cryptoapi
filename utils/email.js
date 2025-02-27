// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

// const transporter = nodemailer.createTransport({
//     host: "email-smtp.eu-north-1.amazonaws.com", // Replace with your SES region
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.AWS_SES_SMTP_USER, 
//         pass: process.env.AWS_SES_SMTP_PASS  
//     }
// });

// export const sendEmail = async (to, subject, text) => {
//     try {
//         await transporter.sendMail({
//             from: process.env.EMAIL_FROM, 
//             to,
//             subject,
//             text,
//         });
//         console.log("✅ Email sent successfully!");
//     } catch (error) {
//         console.error("❌ Email sending failed:", error);
//         throw error;
//     }
// };

// // sendEmail("charlottedavis5604@gmail.com", "Test Email", "Hello from Amazon SES welcome! Ugochukwu");
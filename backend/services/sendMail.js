import nodemailer from "nodemailer";

export const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    console.log(`📩 Warning mail sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending mail:", err);
  }
};

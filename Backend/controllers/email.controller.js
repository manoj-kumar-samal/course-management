
import nodemailer from "nodemailer"
import config from "../config.js";

export const sendEnrollmentEmail = async (req, res) => {
  const { name, email, phone} = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.GMAIL_USER,       
        pass: config.GMAIL_PASS      
      },

      
    });

    await transporter.sendMail({
      from: `"LearnX" <manojkumarsamal2002@gmail.com>`,
      to: 'manojkumarsamal2002@gmail.com',           
      subject: `New Enrollment Request`,
      html: `
        <h2>New Enrollment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });

    res.status(200).json({ message: 'Enrollment email sent successfully!' });
    
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: 'Failed to send enrollment email' });
  }
};


const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

app.use('/send', limiter);


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP
  message: "Too many requests. Please try again later."
});

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running successfully');
});

// Send Mail Route
app.post('/send', async (req, res) => {
  const { name, email, company, phone, district, state, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Please fill all required fields.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Phone: ${phone || 'N/A'}
District: ${district || 'N/A'}
State: ${state || 'N/A'}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({
      message: 'Failed to send message. Try again.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


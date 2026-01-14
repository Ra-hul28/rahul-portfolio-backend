import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: '*',
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend is running successfully');
});


app.post('/send', async (req, res) => {
  const { name, email, company, phone, district, state, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
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
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message. Try again.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



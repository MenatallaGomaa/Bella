const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, "..")));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware (if needed)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your-email@gmail.com", // Your Gmail email address
    pass: "your-password", // Your Gmail password
  },
});

// Endpoint to handle form submission
app.post("/send-email", (req, res) => {
  const { name, phone, person, reservationDate, reservationTime, message } =
    req.body;

  const mailOptions = {
    from: "your-email@gmail.com", // Sender email address
    to: "bellabiladipizza@gmail.com", // Receiver email address
    subject: "Booking Request",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Persons:</strong> ${person}</p>
      <p><strong>Date:</strong> ${reservationDate}</p>
      <p><strong>Time:</strong> ${reservationTime}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

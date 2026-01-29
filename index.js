const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customerRoutes = require('./router/authusers.js').authenticated;
const commonRoutes = require('./router/common.js').general;

const app = express();

app.use(express.json());

// Session middleware
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// Authentication middleware (FIXED ROUTE)
app.use("/customer/auth", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 3001;

// Routes
app.use("/customer", customerRoutes);
app.use("/", commonRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
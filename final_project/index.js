const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/customer/auth/*', function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extract token
    // Verify the token with the same secret used during login
    jwt.verify(token, 'access', { algorithms: ['HS256'] }, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'User not authenticated', error: err.message });
      }
      req.session.username = user; // If valid, attach the user to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    return res.status(403).json({ message: 'User not logged in' });
  }
});

const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));

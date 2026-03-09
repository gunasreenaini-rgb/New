const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Secret key for JWT
const SECRET_KEY = "mysecretkey";

// Dummy user (simulating database)
const user = {
  id: 1,
  username: "Guna",
  password: bcrypt.hashSync("Guna12", 8), // hashed password
};

// Test API
app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check username
  if (username !== user.username) {
    return res.status(401).json({ message: "User not found" });
  }

  // Check password
  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token: token,
  });
});



function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  
  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id;
    next();
  });
}


app.post("/message", verifyToken, (req, res) => {
  const { message } = req.body;

  console.log("User ID:", req.userId);
  console.log("Message:", message);

  res.json({
    reply: `Backend received: ${message}`,
  });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});


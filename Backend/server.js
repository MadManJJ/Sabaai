const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const shops = require("./routes/shops");
const reservations = require("./routes/reservations");
const auth = require("./routes/auth");
const users = require("./routes/users");
// US2-4
const services = require("./routes/services");

const app = express();

app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser
app.use(mongoSanitize()); // Sanitize data
app.use(helmet()); // Set security header
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent http param pollution
app.use(cors()); // Enable CORS
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
// in 10 mins only allow max 100
app.use(limiter);

app.use("/api/v1/shops", shops);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reservations", reservations);
app.use("/api/v1/users", users);
// US2-4
app.use("/api/v1/services" , services);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

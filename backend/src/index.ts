import "dotenv/config";
import express from "express";
import cors from "cors";
import passengerRoutes from "./routes/passenger.js";
import aircraftRoutes from "./routes/aircraft.js";
import flightRoutes from "./routes/flight.js";
import bookingRoutes from "./routes/booking.js";
import paymentRoutes from "./routes/payment.js";
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env["PORT"] ?? 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://hawai-airlines.vercel.app",
];

// Manual CORS headers — guaranteed to run before anything else
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.options("*", cors());

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/passengers", authenticateToken, passengerRoutes);
app.use("/api/aircrafts", aircraftRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", authenticateToken, bookingRoutes);
app.use("/api/payments", authenticateToken, paymentRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✈  Airline Management API running on http://localhost:${PORT}`);
  console.log(`   Health check: GET http://localhost:${PORT}/health`);
});
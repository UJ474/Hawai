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

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://hawai-airlines.vercel.app"],
  credentials: true,
}));
app.options('*', cors());

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes); // Public endpoints for signup/login
app.use("/api/passengers", authenticateToken, passengerRoutes); // Protected mapping
app.use("/api/aircrafts", aircraftRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", authenticateToken, bookingRoutes); // Protected mapping
app.use("/api/payments", authenticateToken, paymentRoutes); // Protected mapping

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✈  Airline Management API running on http://localhost:${PORT}`);
  console.log(`   Health check: GET http://localhost:${PORT}/health`);
});

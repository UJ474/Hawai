import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import HomePage from "./pages/HomePage";
import FlightListPage from "./pages/FlightListPage";
import FlightDetailPage from "./pages/FlightDetailPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import PaymentPage from "./pages/PaymentPage"; // Import new page
import PaymentSuccessPage from "./pages/PaymentSuccessPage"; // Import new page
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/flights"
          element={
            <ProtectedRoute>
              <FlightListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flights/:id"
          element={
            <ProtectedRoute>
              <FlightDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay/:bookingId" // New route for Payment Page
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success/:paymentId" // New route for Payment Success Page
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        {/* Add other routes here as they are developed */}
      </Routes>
    </>
  );
}

export default App;

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, onlyForVerified = false }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isVerified = useSelector((state) => state.auth.isVerified);

  if (!isLoggedIn) {
    // If not logged in, navigate to the login page
    return <Navigate to="/" replace />;
  }

  if (onlyForVerified && isVerified) {
    // If the user is verified, redirect to the home page
    return <Navigate to="/"  />;
  }

  return children; // Render the protected component
};

export default ProtectedRoute;

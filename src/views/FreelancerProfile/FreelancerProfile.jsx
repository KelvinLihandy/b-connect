import React from "react";
import { useParams, Navigate } from "react-router-dom";

/**
 * FreelancerProfile component that serves as a router/controller for different freelancer profile views
 * This component decides which view to show based on parameters or user state
 */
const FreelancerProfile = () => {
  const { id } = useParams();
  
  // This component can be expanded to add logic for determining which view to show
  // For now, it will redirect to the FreelancerView component
  return <Navigate to={`/freelancer/${id}`} replace />;
};

export default FreelancerProfile;
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Importing Navigate component from react-router-dom for navigation
import { Store } from '../Store'; // Importing Store context to access user information

export default function ProtectedRoute({ children }) {
  const { state } = useContext(Store); // Accessing global state from Store context
  const { userInfo } = state; // Destructuring userInfo from global state

  // Rendering children if userInfo exists, otherwise navigating to sign-in page
  return userInfo ? children : <Navigate to='/signin' />;
}

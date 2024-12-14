import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '../appContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { authToken } = useAppContext();
    
    if (!authToken) {
      // If no authToken, redirect to login page
      return <Navigate to='/login' />;
    }
    return children;
  };
export default ProtectedRoute;  
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from '../pages/AuthPage'
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AuthPage />;
};
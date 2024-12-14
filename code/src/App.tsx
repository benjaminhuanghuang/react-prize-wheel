import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Context
import { AppProvider, useAppContext } from './appContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authToken } = useAppContext();
  if (!authToken) {
    // If no authToken, redirect to login page
    return <Navigate to='/login' />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route
            path='/about'
            element={<About />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='*'
            element={<NotFound />}
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

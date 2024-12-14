import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
// Components
import ProtectedRoute from './components/ProtectedRoute';
// Context
import { AppProvider } from './appContext';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
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
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

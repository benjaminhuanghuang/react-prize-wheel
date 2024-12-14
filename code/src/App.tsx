import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
// Context
import { AppProvider } from './appContext';

function App() {

  return (
    <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/about'
          element={<About />}
        />
      </Routes>
    </BrowserRouter>
    </AppProvider>
  );
}

export default App;

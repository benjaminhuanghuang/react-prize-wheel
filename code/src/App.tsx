import { BrowserRouter, Routes, Route } from "react-router-dom";
// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
// Components

function App() {
  
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App

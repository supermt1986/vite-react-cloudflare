// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BlogIndex />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
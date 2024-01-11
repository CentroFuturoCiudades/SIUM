import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Problematica from "./views/Problematica";
import Home from "./views/Home";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problematica" element={<Problematica />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

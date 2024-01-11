import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Problematica from "./views/Problematica";
import Home from "./views/Home";

function App() {
  return (
    <BrowserRouter basename={"/SIUM"}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/problematica" element={<Problematica />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

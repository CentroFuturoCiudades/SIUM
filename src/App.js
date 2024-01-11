import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./views/Body";
import Title from "./views/Title";
import Cards from "./views/Cards";
import BodyText from "./views/BodyText";

function App() {
  return (
    <BrowserRouter basename={"/SIUM"}>
      <Routes>
        <Route path="/" exact element={<Title />} />
        <Route path="/introduccion" element={<BodyText />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/problematica" element={<Body />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

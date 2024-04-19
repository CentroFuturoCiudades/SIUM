import { BrowserRouter, Route, Routes } from "react-router-dom";
import Problematica from "./views/Problematica";
import Home from "./views/Home";
import DescargaDatos from "./views/DescargaDatos";
import Equipo from "./views/Equipo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/problematica" element={<Problematica />} />
        <Route path="/descargas" element={<DescargaDatos />} />
        <Route path="/acerca" element={<Equipo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

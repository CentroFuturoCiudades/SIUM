import { BrowserRouter, Route, Routes } from "react-router-dom";
import Problematica from "./views/Problematica";
import Home from "./views/Home";
import DescargaDatos from "./views/DescargaDatos";
import Equipo from "./views/Equipo";
import Objetivo from "./views/Objetivo";

function App() {
  return (
    <BrowserRouter basename={"/SIUM"}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/problematica" element={<Problematica />} />
        <Route path="/descargas" element={<DescargaDatos/>}/>
        <Route path="/equipo" element={<Equipo/>}/>
        <Route path="/objetivo" element={<Objetivo/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

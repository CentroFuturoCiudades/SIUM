import { BrowserRouter, Route, Routes } from "react-router-dom";
import Problematica from "./views/Problematica";
import Home from "./views/Home";
import DescargaDatos from "./views/DescargaDatos";

function App() {
  return (
    <BrowserRouter basename={"/SIUM"}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/problematica" element={<Problematica />} />
         <Route path='/descarga' element={<DescargaDatos/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

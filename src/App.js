import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Body from "./views/Body";
import Title from "./views/Title";
import Cards from "./views/Cards";
import BodyText from "./views/BodyText";
import DescargaDatos from "./views/DescargaDatos";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={ <Title/> }/> 
          <Route path='/introduccion' element={ <BodyText/> }/> 
          <Route path='/cards' element={ <Cards/> }/> 
          <Route path='/problematica' element={ <Body/> }/>
          <Route path='/descarga' element={<DescargaDatos/>}/>
        </Routes>    
      </Router>
    </div>
  );
}

export default App;

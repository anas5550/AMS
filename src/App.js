import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Hero from './components/Hero';
import prismColors from './constant';
import HowToUse from './components/HowToUse';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div style={{ background: prismColors.bg, color: "white", height: "100vh", overflowX: "hidden" }}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/AMS" element={<Hero />} />
          <Route path="/AMS/how-to-use" element={<HowToUse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

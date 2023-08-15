import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Hero from './components/Hero';
import prismColors from './constant';
function App() {
  return (
    <div style={{ background: prismColors.bg, color: "white", height: "100vh", overflowX: "hidden" }}>
      <Header />
      <Hero />
    </div>
  );
}

export default App;

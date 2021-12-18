import React from "react";
import './App.css';
import Home from './pages/Home';
import JournalInterface from './pages/JournalInterface';
import Navbar from '../src/components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/journal" exact element={<JournalInterface/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
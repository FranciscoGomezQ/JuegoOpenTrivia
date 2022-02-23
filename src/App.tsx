import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainForm from "./views/MainForm/MainForm";
import Questions from "./views/Questions/Questions";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainForm />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;

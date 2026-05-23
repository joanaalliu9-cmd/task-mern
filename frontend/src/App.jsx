import {BrowserRouter, Routes, Route } from "react-router";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
    <div className="container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App
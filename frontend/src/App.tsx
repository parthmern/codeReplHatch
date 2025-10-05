import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { Repl } from "./components/pages/Repl";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repl/:lang/:id" element={<Repl />} />
      </Routes>
    </Router>
  );
}

export default App;

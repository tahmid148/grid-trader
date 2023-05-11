// import Dashboard from "./Dashboard/Dashboard";
import Home from "./Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<></>} />
      </Routes>
    </Router>
  );
}

export default App;

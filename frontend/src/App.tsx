// import Dashboard from "./Dashboard/Dashboard";
// import Home from "./Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/dash" element={<></>} />
      </Routes>
    </Router>
  );
}

export default App;

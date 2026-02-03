import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Globe from "./pages/Globe";
import Countries from "./pages/Countries";
import CountryDetails from "./pages/CountryDetails";
import Analytics from "./pages/Analytics";
import Favourites from "./pages/Favourites";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#141414", minHeight: "100vh" }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<Globe />} />
          <Route path="/countries" element={<Countries/>}/>
          <Route path="/countries/:name" element={<CountryDetails/>}/>
          <Route path="/analytics" element={<Analytics/>}/>
          <Route path="/favourites" element={<Favourites/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

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
import ProtectedRoute from "./components/ProtectedRoute";
import Sports from "./pages/sports";
import SportDetails from "./pages/SportDetails";
import "./styles/cards.css";
import Athletes from "./pages/Athletes";
import AthleteDetails from "./pages/AthleteDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#141414", minHeight: "100vh" }}>
        <Header />
        <div style={{ paddingTop: "70px" }}>

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/countries/:name" element={<CountryDetails />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:name" element={<SportDetails />} />
            <Route path="/athletes" element={<Athletes />} />
            <Route path="/athletes/:name" element={<AthleteDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />


            {/* Protected routes */}
            <Route
              path="/favourites"
              element={
                <ProtectedRoute>
                  <Favourites />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/favourites"
              element={
                <ProtectedRoute>
                  <Favourites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />


            <Route
              path="/globe"
              element={
                <ProtectedRoute>
                  <Globe />
                </ProtectedRoute>
              }
            />
          </Routes >
        </div >
      </div >
    </Router >
  );
}

export default App;

import React, { useRef, useEffect, useMemo, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
const OLYMPIC_DATA = [
  // North America
  { name: "United States", lat: 39.8, lng: -98.5, gold: 1219, silver: 1000, bronze: 876 },
  { name: "Canada", lat: 56.1, lng: -106.3, gold: 80, silver: 100, bronze: 151 },
  { name: "Mexico", lat: 23.6, lng: -102.5, gold: 13, silver: 27, bronze: 37 },
  { name: "Cuba", lat: 21.5, lng: -77.7, gold: 86, silver: 70, bronze: 88 },
  { name: "Jamaica", lat: 18.1, lng: -77.3, gold: 27, silver: 39, bronze: 28 },
  { name: "Bahamas", lat: 25.0, lng: -77.3, gold: 8, silver: 2, bronze: 6 },
  { name: "Trinidad and Tobago", lat: 10.6, lng: -61.2, gold: 3, silver: 5, bronze: 11 },

  // South America
  { name: "Brazil", lat: -14.2, lng: -51.9, gold: 40, silver: 49, bronze: 81 },
  { name: "Argentina", lat: -38.4, lng: -63.6, gold: 22, silver: 27, bronze: 31 },
  { name: "Colombia", lat: 4.5, lng: -74.2, gold: 5, silver: 16, bronze: 17 },
  { name: "Chile", lat: -35.6, lng: -71.5, gold: 3, silver: 8, bronze: 4 },
  { name: "Venezuela", lat: 6.4, lng: -66.5, gold: 3, silver: 4, bronze: 5 },
  { name: "Ecuador", lat: -1.8, lng: -78.1, gold: 3, silver: 1, bronze: 2 },
  { name: "Uruguay", lat: -32.5, lng: -55.7, gold: 2, silver: 2, bronze: 6 },

  // Europe (Western & Central)
  { name: "Great Britain", lat: 55.3, lng: -3.4, gold: 318, silver: 317, bronze: 320 },
  { name: "France", lat: 46.2, lng: 2.2, gold: 310, silver: 344, bronze: 360 },
  { name: "Germany", lat: 51.1, lng: 10.4, gold: 318, silver: 317, bronze: 320 }, // Combined all German teams
  { name: "Italy", lat: 41.8, lng: 12.5, gold: 281, silver: 319, bronze: 354 },
  { name: "Spain", lat: 40.4, lng: -3.7, gold: 54, silver: 77, bronze: 61 },
  { name: "Netherlands", lat: 52.1, lng: 5.2, gold: 163, silver: 161, bronze: 179 },
  { name: "Belgium", lat: 50.5, lng: 4.4, gold: 49, silver: 59, bronze: 67 },
  { name: "Switzerland", lat: 46.8, lng: 8.2, gold: 67, silver: 82, bronze: 94 },
  { name: "Austria", lat: 47.5, lng: 14.5, gold: 93, silver: 123, bronze: 135 },
  { name: "Ireland", lat: 53.4, lng: -8.2, gold: 15, silver: 10, bronze: 17 },
  { name: "Portugal", lat: 39.3, lng: -8.2, gold: 6, silver: 11, bronze: 15 },

  // Europe (Nordic)
  { name: "Sweden", lat: 60.1, lng: 18.6, gold: 157, silver: 189, bronze: 232 },
  { name: "Norway", lat: 60.4, lng: 8.4, gold: 192, silver: 165, bronze: 162 },
  { name: "Finland", lat: 61.9, lng: 25.7, gold: 101, silver: 85, bronze: 119 },
  { name: "Denmark", lat: 56.2, lng: 9.5, gold: 50, silver: 81, bronze: 84 },

  // Europe (Eastern & Former Soviet)
  { name: "Russia", lat: 61.5, lng: 105.3, gold: 193, silver: 164, bronze: 185 }, // Russia only (not combined with USSR)
  { name: "Soviet Union", lat: 60.0, lng: 100.0, gold: 473, silver: 376, bronze: 355 }, // Historical
  { name: "Ukraine", lat: 48.3, lng: 31.1, gold: 41, silver: 43, bronze: 76 },
  { name: "Poland", lat: 51.9, lng: 19.1, gold: 73, silver: 93, bronze: 142 },
  { name: "Hungary", lat: 47.1, lng: 19.5, gold: 193, silver: 164, bronze: 185 },
  { name: "Romania", lat: 45.9, lng: 24.9, gold: 93, silver: 101, bronze: 124 },
  { name: "Bulgaria", lat: 42.7, lng: 25.4, gold: 58, silver: 91, bronze: 88 },
  { name: "Czech Republic", lat: 49.8, lng: 15.4, gold: 32, silver: 33, bronze: 41 },
  { name: "Slovakia", lat: 48.6, lng: 19.6, gold: 14, silver: 18, bronze: 11 },
  { name: "Belarus", lat: 53.7, lng: 27.9, gold: 21, silver: 37, bronze: 47 },
  { name: "Serbia", lat: 44.0, lng: 21.0, gold: 9, silver: 8, bronze: 12 },
  { name: "Croatia", lat: 45.1, lng: 15.2, gold: 20, silver: 21, bronze: 18 },
  { name: "Slovenia", lat: 46.1, lng: 14.9, gold: 14, silver: 18, bronze: 23 },
  { name: "Greece", lat: 39.0, lng: 21.8, gold: 36, silver: 46, bronze: 47 },
  { name: "Estonia", lat: 58.5, lng: 25.0, gold: 14, silver: 11, bronze: 19 },
  { name: "Latvia", lat: 56.8, lng: 24.6, gold: 6, silver: 9, bronze: 15 },
  { name: "Lithuania", lat: 55.1, lng: 23.8, gold: 10, silver: 9, bronze: 17 },

  // Asia
  { name: "China", lat: 35.8, lng: 104.1, gold: 325, silver: 258, bronze: 221 },
  { name: "Japan", lat: 36.2, lng: 138.2, gold: 216, silver: 232, bronze: 242 },
  { name: "South Korea", lat: 35.9, lng: 127.7, gold: 117, silver: 128, bronze: 137 },
  { name: "India", lat: 20.5, lng: 78.9, gold: 10, silver: 14, bronze: 16 },
  { name: "North Korea", lat: 40.3, lng: 127.5, gold: 16, silver: 18, bronze: 27 },
  { name: "Iran", lat: 32.4, lng: 53.6, gold: 27, silver: 29, bronze: 32 },
  { name: "Kazakhstan", lat: 48.0, lng: 66.9, gold: 16, silver: 28, bronze: 42 },
  { name: "Uzbekistan", lat: 41.3, lng: 64.5, gold: 19, silver: 8, bronze: 23 },
  { name: "Thailand", lat: 15.8, lng: 100.9, gold: 11, silver: 11, bronze: 19 },
  { name: "Indonesia", lat: -0.7, lng: 113.9, gold: 10, silver: 14, bronze: 16 },
  { name: "Turkey", lat: 38.9, lng: 35.2, gold: 41, silver: 29, bronze: 41 },
  { name: "Chinese Taipei", lat: 23.6, lng: 120.9, gold: 9, silver: 11, bronze: 23 },
  { name: "Mongolia", lat: 46.8, lng: 103.8, gold: 2, silver: 11, bronze: 9 },
  { name: "Pakistan", lat: 30.3, lng: 69.3, gold: 3, silver: 4, bronze: 5 },
  { name: "Philippines", lat: 12.8, lng: 121.7, gold: 1, silver: 4, bronze: 3 },

  // Oceania
  { name: "Australia", lat: -25.2, lng: 133.7, gold: 188, silver: 199, bronze: 232 },
  { name: "New Zealand", lat: -40.9, lng: 174.8, gold: 65, silver: 42, bronze: 56 },
  { name: "Fiji", lat: -17.7, lng: 178.0, gold: 2, silver: 1, bronze: 1 },

  // Africa
  { name: "Kenya", lat: -0.0, lng: 37.9, gold: 39, silver: 44, bronze: 41 },
  { name: "South Africa", lat: -30.5, lng: 22.9, gold: 28, silver: 36, bronze: 31 },
  { name: "Ethiopia", lat: 9.1, lng: 40.4, gold: 24, silver: 16, bronze: 22 },
  { name: "Egypt", lat: 26.8, lng: 30.8, gold: 9, silver: 12, bronze: 20 },
  { name: "Nigeria", lat: 9.0, lng: 8.6, gold: 3, silver: 11, bronze: 13 },
  { name: "Morocco", lat: 31.7, lng: -7.0, gold: 8, silver: 5, bronze: 13 },
  { name: "Algeria", lat: 28.0, lng: 1.6, gold: 7, silver: 4, bronze: 9 },
  { name: "Tunisia", lat: 33.8, lng: 9.5, gold: 6, silver: 4, bronze: 8 },
  { name: "Zimbabwe", lat: -19.0, lng: 29.1, gold: 3, silver: 5, bronze: 1 },
  { name: "Uganda", lat: 1.3, lng: 32.2, gold: 4, silver: 5, bronze: 6 },
];


function GlobalMedalView() {
  const globeEl = useRef();
  const navigate = useNavigate();

  const [hoveredData, setHoveredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Medal Bars
  const barsData = useMemo(() => {
    const data = [];
    OLYMPIC_DATA.forEach((country) => {
      const spacing = 0.6;

      data.push({
        type: "Gold",
        val: country.gold,
        color: "#FFD700",
        lat: country.lat,
        lng: country.lng - spacing,
        country: country.name
      });

      data.push({
        type: "Silver",
        val: country.silver,
        color: "#E0E0E0",
        lat: country.lat,
        lng: country.lng,
        country: country.name
      });

      data.push({
        type: "Bronze",
        val: country.bronze,
        color: "#CD7F32",
        lat: country.lat,
        lng: country.lng + spacing,
        country: country.name
      });
    });
    return data;
  }, []);

  // Initial globe settings
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.1;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.0 });
    }
  }, []);

  // Search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries([]);
      return;
    }

    const results = OLYMPIC_DATA.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCountries(results);
  }, [searchTerm]);

  // When selecting country
  const handleSelectCountry = (country) => {
    setSearchTerm(country.name);
    setShowDropdown(false);

    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;

      globeEl.current.pointOfView(
        {
          lat: country.lat,
          lng: country.lng,
          altitude: 1.5
        },
        1500
      );
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "30px",
          zIndex: 10
        }}
      >
        <h1
          style={{
            color: "#fff",
            margin: "0 0 5px 0",
            textShadow: "0 0 10px rgba(255,215,0,0.5)"
          }}
        >
          Global Medal Tracker
        </h1>
      </div>

      {/* SEARCH BAR */}
      <div
        style={{
          position: "absolute",
          top: "160px",
          left: "30px",
          zIndex: 20,
          width: "300px"
        }}
      >
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          style={{
            width: "100%",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            outline: "none"
          }}
        />

        {showDropdown && filteredCountries.length > 0 && (
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "8px",
              marginTop: "5px",
              maxHeight: "200px",
              overflowY: "auto"
            }}
          >
            {filteredCountries.map((country) => (
              <div
                key={country.name}
                onClick={() => handleSelectCountry(country)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #222",
                  color: "#fff"
                }}
              >
                {country.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NAV BUTTON */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "100px",
          right: "30px",
          zIndex: 20,
          background: "rgba(255,255,255,0.1)",
          color: "white",
          border: "1px solid #444",
          padding: "10px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          fontWeight: "600"
        }}
      >
        Back Home
      </button>

      {/* TOOLTIP */}
      {hoveredData && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            pointerEvents: "none",
            textAlign: "center",
            background: "rgba(0,0,0,0.9)",
            padding: "20px",
            borderRadius: "12px",
            border: `2px solid ${hoveredData.color}`,
            boxShadow: `0 0 20px ${hoveredData.color}40`
          }}
        >
          <h2 style={{ color: "white", margin: "0 0 10px 0" }}>
            {hoveredData.country}
          </h2>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: hoveredData.color
            }}
          >
            {hoveredData.val}
          </div>
          <div style={{ color: "#bbb", textTransform: "uppercase" }}>
            {hoveredData.type} Medals
          </div>
        </div>
      )}

      {/* GLOBE */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        objectsData={barsData}
        objectLat="lat"
        objectLng="lng"
        objectAltitude={0}
        objectThreeObject={(d) => {
          const height = Math.max(d.val * 0.01, 0.2);
          const radius = 0.9;
          const geometry = new THREE.CylinderGeometry(
            radius,
            radius,
            height,
            8
          );
          geometry.translate(0, height / 2, 0);

          const material = new THREE.MeshBasicMaterial({
            color: d.color,
            opacity: 0.9,
            transparent: true
          });

          return new THREE.Mesh(geometry, material);
        }}
        onObjectHover={setHoveredData}
        objectLabel={null}
      />
    </div>
  );
}

export default GlobalMedalView;
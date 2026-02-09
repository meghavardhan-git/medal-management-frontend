import { countryImages } from "../utils/countryImages";

function CountryCard({ country, onClick }) {
  const flagUrl = countryImages[country.code];
  
  return (
    <div
      onClick={onClick}
      style={{
        background: "#1f1f1f",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ width: "100%", height: "160px", overflow: "hidden", backgroundColor: "#0a0a0a" }}>
        {flagUrl ? (
          <img
            src={flagUrl}
            alt={country.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              console.warn(`Flag failed to load for ${country.code}:`, flagUrl);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "#333",
            color: "#999",
            fontSize: "12px"
          }}>
            No flag available
          </div>
        )}
      </div>

      <div style={{ padding: "10px", color: "white", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <h6 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>{country.name}</h6>
        <small style={{ color: "#aaa", fontSize: "12px" }}>
          🥇 {country.gold} 🥈 {country.silver} 🥉 {country.bronze}
        </small>
      </div>
    </div>
  );
}

export default CountryCard;

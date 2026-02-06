import { getFlagUrl } from "../utils/flagUtils";

function CountryCard({ country, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#1f1f1f",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <img
        src={getFlagUrl(country.code)}
        alt={country.name}
        style={{ width: "100%", height: "140px", objectFit: "cover" }}
        onError={(e) => (e.target.src = "/images/fallback-flag.png")}
      />

      <div style={{ padding: "10px", color: "white" }}>
        <h6>{country.name}</h6>
        <small>
          🥇 {country.gold} 🥈 {country.silver} 🥉 {country.bronze}
        </small>
      </div>
    </div>
  );
}

export default CountryCard;

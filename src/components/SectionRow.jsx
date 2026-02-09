import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { getFlagUrl } from "../utils/flagUtils";

function SectionRow({ title, items, basePath, explorePath }) {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "50px" }}>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h4 style={{ color: "white" }}>{title}</h4>

        {explorePath && (
          <Button
            variant="link"
            style={{ color: "#e50914", textDecoration: "none" }}
            onClick={() => navigate(explorePath)}
          >
            Explore More →
          </Button>
        )}
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        {items.map((item, index) => (
          <Card
            key={index}
            className="netflix-card" // ✅ Added class here
            style={{
              minWidth: "220px",
              background: "#1f1f1f",
              cursor: "pointer",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            onClick={() => {
              // Support object value for compound routes (e.g., {name, sport})
              if (item.value && typeof item.value === "object") {
                const name = item.value.name || item.value.label || item.value.value;
                const sport = item.value.sport || item.value.category;
                if (name && sport) {
                  navigate(`${basePath}/${encodeURIComponent(name)}/${encodeURIComponent(sport)}`);
                  return;
                }
              }
              navigate(`${basePath}/${encodeURIComponent(item.value)}`);
            }}
          >
            {/* IMAGE LOGIC (IMPORTANT PART) */}
            <Card.Img
              variant="top"
              src={
                basePath === "/countries"
                  ? (item.image || getFlagUrl(item.value))
                  : (item.image || "/images/fallback-card.png")
              }
              alt={item.label}
              style={{
                height: "140px",
                objectFit: "cover",
              }}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/fallback-card.png";
              }}
            />

            <Card.Body>
              <Card.Title
                style={{
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: "0",
                }}
              >
                {item.label || item.name || item.value || "Unknown"}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SectionRow;
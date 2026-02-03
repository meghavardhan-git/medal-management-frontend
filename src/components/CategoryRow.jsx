function CategoryRow({ title, items }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h4 style={{ color: "white", marginLeft: "20px" }}>{title}</h4>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "20px",
          gap: "16px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: "220px",
              height: "130px",
              borderRadius: "6px",
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <div
              style={{
                height: "100%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))",
                color: "white",
                display: "flex",
                alignItems: "flex-end",
                padding: "10px",
                fontWeight: "bold",
                borderRadius: "6px",
              }}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryRow;

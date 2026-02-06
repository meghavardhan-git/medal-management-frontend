function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111",
        color: "#aaa",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        <div>
          <h6 style={{ color: "white" }}>Medal Management</h6>
          <p style={{ fontSize: "14px" }}>
            Olympic medal analytics and insights platform.
          </p>
        </div>

        <div>
          <h6 style={{ color: "white" }}>Explore</h6>
          <p><a href="/countries">Countries</a></p>
          <p><a href="/sports">Sports</a></p>
          <p><a href="/athletes">Athletes</a></p>
        </div>

        <div>
          <h6 style={{ color: "white" }}>Technology</h6>
          <p>React</p>
          <p>ASP.NET Core</p>
          <p>SQL Server</p>
        </div>

        <div>
          <h6 style={{ color: "white" }}>Project</h6>
          <p>About</p>
          <p>Architecture</p>
          <p><a href=""></a></p>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "13px",
          color: "#777",
        }}
      >
        © 2026 Medal Management System. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

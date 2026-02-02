function CategoryRow({ title, items }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      {/* Title Style */}
      <h4 style={{ 
          color: "white",        
          marginLeft: "20px"     
      }}>
        {title}
      </h4>

      {/* row Container (Scrollable Area) */}
      <div
        style={{
          display: "flex",      
          overflowX: "auto",    
          padding: "20px",       
          gap: "15px",           
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: "200px",         // Box size taggakunda, minimum 200px undali
              height: "120px",           // Box height 120px undali
              backgroundColor: "#222",  
              
              borderRadius: "6px",       // Edges sharp ga kakunda, konchem round (smooth) ga ravadaniki
              
              display: "flex",          
              alignItems: "center",     
              justifyContent: "center",  
              
              color: "white",            
              cursor: "pointer",         
              transition: "transform 0.3s", 
            }}
            
            // Mouse Events (Animation kosam)
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)") 
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")   
            }
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryRow;
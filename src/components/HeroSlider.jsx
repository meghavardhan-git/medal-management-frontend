import { Carousel, Button } from "react-bootstrap";

function HeroSlider() {
  return (
    <Carousel fade interval={8000} controls={false}>
      
      {/*Mb Running video file */}
      <Carousel.Item>
        <div style={{ position: "relative", height: "65vh", width: "100%", overflow: "hidden" }}>
          
          {/* VIDEO ELEMENT */}
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover", 
              zIndex: 0,
            }}
          >
            {}
            <source src="/mb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/*dark overlay*/}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)", //0.5 dark color kosam
              zIndex: 1,
            }}
          ></div>

          {/* text */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              paddingLeft: "60px",
              color: "white",
            }}
          >
            <div style={{ maxWidth: "600px" }}>
              <h1>Olympic Medal Leaders</h1>
              <p>Explore Stylish Runners</p>
              <Button variant="danger">Explore Athelets</Button>
            </div>
          </div>
        </div>
      </Carousel.Item>


      {/* 2nd image*/}
      <Carousel.Item>
        <div
          style={{
            height: "65vh",
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1509228468518-180dd4864904')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            paddingLeft: "60px",
          }}
        >
          <div style={{ color: "white", maxWidth: "600px" }}>
            <h1>Track Medals by Sport</h1>
            <p>Analyze Olympic performance sport-wise</p>
            <Button variant="danger">View Sports</Button>
          </div>
        </div>
      </Carousel.Item>

      {/*3rd image*/}
      <Carousel.Item>
        <div
          style={{
            height: "65vh",
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            paddingLeft: "60px",
          }}
        >
          <div style={{ color: "white", maxWidth: "600px" }}>
            <h1>Global Medal View</h1>
            <p>Visualize medals on a 3D globe</p>
            <Button variant="danger">Open Globe</Button>
          </div>
        </div>
      </Carousel.Item>

    </Carousel>
  );
}

export default HeroSlider;
import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  const [pcs, setPcs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/pcs")
      .then(res => res.json())
      .then(data => setPcs(data));
  }, []);

  return (
    <div style={{ position: "relative" }}>

      {/* Floor plan */}
      <img
        src="/floorplan.png"
        alt="Floor Plan"
        style={{ width: "800px" }}
      />

      {/* Render PCs */}
      {pcs.map(pc => (
        <PcMarker
          key={pc.id}
          x={pc.x_position}
          y={pc.y_position}
          status={pc.status}
        />
      ))}

    </div>
  );
}

export default FloorMap;
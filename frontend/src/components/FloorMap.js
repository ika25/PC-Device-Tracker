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
      {pcs.map(pc => (              // Loop through all PCs from database
        <PcMarker
          key={pc.id}              // unique key for React
          x={pc.x_position}        // X coordinate on map
          y={pc.y_position}        // Y coordinate on map
          status={pc.status}       // used for color
          pc={pc}                  // pass full object for popup
        />
      ))}

    </div>
  );
}

export default FloorMap;
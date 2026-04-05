import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  const [pcs, setPcs] = useState([]);

  // ===============================
  // ZOOM + PAN STATE
  // ===============================
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  // ===============================
  // SEARCH
  // ===============================
  const [search, setSearch] = useState("");

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/pcs");
    const data = await res.json();
    setPcs(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===============================
  // ZOOM (MOUSE WHEEL)
  // ===============================
  const handleWheel = (e) => {
    e.preventDefault();

    const zoomSpeed = 0.1;

    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + zoomSpeed, 3));
    } else {
      setScale(prev => Math.max(prev - zoomSpeed, 0.5));
    }
  };

  // ===============================
  // PAN (DRAG MAP)
  // ===============================
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search PC..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />

      {/* MAP WRAPPER */}
      <div
        style={{
          width: "800px",
          height: "500px",
          overflow: "hidden",
          border: "1px solid black",
          cursor: isDragging ? "grabbing" : "grab"
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >

        {/* ZOOM + PAN CONTAINER */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "top left",
            position: "relative"
          }}
        >

          {/* FLOOR PLAN */}
          <img
            src="/floorplan.png"
            alt="Floor Plan"
            style={{ width: "800px", display: "block" }}
          />

          {/* PCS */}
          {pcs
            .filter(pc => pc.x_position !== null && pc.y_position !== null)
            .map(pc => {

              const isMatch = pc.hostname
                .toLowerCase()
                .includes(search.toLowerCase());

              return (
                <PcMarker
                  key={pc.id}
                  x={Number(pc.x_position)}
                  y={Number(pc.y_position)}
                  status={pc.status}
                  pc={pc}
                  refresh={fetchData}
                  highlight={isMatch}
                />
              );
            })
          }

        </div>
      </div>
    </div>
  );
}

export default FloorMap;
import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

  const [pcs, setPcs] = useState([]);
  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("Floor 1");

  // ===============================
  // ZOOM + PAN STATE
  // ===============================
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingMap, setDraggingMap] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

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
  // ZOOM (SCROLL)
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
  // PAN MAP
  // ===============================
  const handleMouseDown = (e) => {
    // ignore if clicking marker
    if (e.target.tagName !== "IMG") return;

    setDraggingMap(true);
    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingMap) return;

    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y
    });
  };

  const handleMouseUp = () => {
    setDraggingMap(false);
  };

  // ===============================
  // ADD PC FORM
  // ===============================
  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    hostname: "",
    ip_address: "",
    desk_id: ""
  });

  const handleMapClick = (e) => {
    if (e.target.tagName !== "IMG") return;

    const rect = e.target.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);

    setClickPosition({ x, y });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPC = {
      ...formData,
      status: "online",
      x_position: clickPosition.x,
      y_position: clickPosition.y,
      floor: floor
    };

    await fetch("http://localhost:5000/api/pcs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPC)
    });

    setShowForm(false);
    fetchData();
  };

  // ===============================
  // DRAG & DROP (FIXED FOR ZOOM)
  // ===============================
  const handleDrop = async (e) => {

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    const x = Math.floor((e.clientX - rect.left) / scale);
    const y = Math.floor((e.clientY - rect.top) / scale);

    const pcId = e.dataTransfer.getData("pcId");

    await fetch(`http://localhost:5000/api/pcs/${pcId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x_position: x,
        y_position: y
      })
    });

    fetchData();
  };

  const allowDrop = (e) => e.preventDefault();

  const visiblePCs = pcs.filter(pc => pc.floor === floor);

  // ===============================
  // RENDER
  // ===============================
  return (
    <div>

      {/* FLOOR SELECTOR */}
      <select value={floor} onChange={(e) => setFloor(e.target.value)}>
        <option>Floor 1</option>
        <option>Floor 2</option>
        <option>Floor 3</option>
      </select>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      {/* VIEWPORT */}
      <div
        style={{
          width: "800px",
          height: "500px",
          overflow: "hidden",
          border: "1px solid black",
          cursor: draggingMap ? "grabbing" : "grab"
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >

        {/* TRANSFORM LAYER */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "top left",
            position: "relative"
          }}
          onDrop={handleDrop}
          onDragOver={allowDrop}
        >

          {/* IMAGE */}
          <img
            src="/floorplan.png"
            alt="Floor Plan"
            style={{ width: "800px" }}
            onClick={handleMapClick}
          />

          {/* FORM */}
          {showForm && (
            <div style={{
              position: "absolute",
              left: clickPosition.x,
              top: clickPosition.y,
              background: "white",
              padding: "10px",
              border: "1px solid black",
              zIndex: 10000
            }}>
              <form onSubmit={handleSubmit}>
                <input name="hostname" placeholder="Hostname" onChange={handleChange} required /><br />
                <input name="ip_address" placeholder="IP" onChange={handleChange} required /><br />
                <input name="desk_id" placeholder="Desk" onChange={handleChange} required /><br />
                <button type="submit">Save</button>
              </form>
            </div>
          )}

          {/* PCS */}
          {visiblePCs.map(pc => {

            const isMatch = pc.hostname.toLowerCase().includes(search.toLowerCase());

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
          })}

        </div>
      </div>
    </div>
  );
}

export default FloorMap;
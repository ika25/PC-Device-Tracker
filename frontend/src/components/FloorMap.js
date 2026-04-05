import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";
import Sidebar from "./Sidebar";

function FloorMap() {

  const [pcs, setPcs] = useState([]);
  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("Floor 1");
  const [addMode, setAddMode] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);

  // FLOOR IMAGES
  const floorImages = {
    "Floor 1": "/floor1.png",
    "Floor 2": "/floor2.png",
    "Floor 3": "/floor3.png"
  };

  // GRID + SMART SNAP
  const GRID_SIZE = 20;
  const SNAP_THRESHOLD = 6;

  const snapToGrid = (value) => {
    const nearest = Math.round(value / GRID_SIZE) * GRID_SIZE;
    return Math.abs(value - nearest) <= SNAP_THRESHOLD ? nearest : value;
  };

  // ZOOM + PAN
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [draggingMap, setDraggingMap] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;

    if (e.deltaY < 0) setScale(prev => Math.min(prev + zoomSpeed, 3));
    else setScale(prev => Math.max(prev - zoomSpeed, 0.5));
  };

  const handleMouseDown = (e) => {
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

  const handleMouseUp = () => setDraggingMap(false);

  // FETCH
  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/pcs");
    const data = await res.json();
    setPcs(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE FROM SIDEBAR
  const handleDeleteFromSidebar = async (id) => {
    await fetch(`http://localhost:5000/api/pcs/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  // ADD FORM
  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    hostname: "",
    ip_address: "",
    desk_id: ""
  });

  const handleMapClick = (e) => {
    if (!addMode) return;
    if (e.target.tagName !== "IMG") return;

    const rect = e.target.getBoundingClientRect();

    const rawX = (e.clientX - rect.left) / scale;
    const rawY = (e.clientY - rect.top) / scale;

    const x = snapToGrid(rawX);
    const y = snapToGrid(rawY);

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
    setFormData({ hostname: "", ip_address: "", desk_id: "" });
    setAddMode(false);

    fetchData();
  };

  // DRAG DROP
  const handleDrop = async (e) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    const rawX = (e.clientX - rect.left) / scale;
    const rawY = (e.clientY - rect.top) / scale;

    const x = snapToGrid(rawX);
    const y = snapToGrid(rawY);

    const pcId = e.dataTransfer.getData("pcId");

    await fetch(`http://localhost:5000/api/pcs/${pcId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x_position: x, y_position: y })
    });

    fetchData();
  };

  const allowDrop = (e) => e.preventDefault();

  const visiblePCs = pcs.filter(pc => pc.floor === floor);

  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <Sidebar
        pcs={visiblePCs}
        onDelete={handleDeleteFromSidebar}
        onSelect={(pc) => setSelectedPC(pc)}
      />

      <div style={{ padding: "10px" }}>

        {/* CONTROLS */}
        <select value={floor} onChange={(e) => setFloor(e.target.value)}>
          <option>Floor 1</option>
          <option>Floor 2</option>
          <option>Floor 3</option>
        </select>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={() => setAddMode(!addMode)}
          style={{
            marginLeft: "10px",
            background: addMode ? "green" : "gray",
            color: "white"
          }}
        >
          {addMode ? "Click map to place PC" : "Add PC"}
        </button>

        {/* MAP */}
        <div
          style={{
            width: "800px",
            height: "500px",
            overflow: "hidden",
            border: "1px solid black",
            cursor: addMode ? "crosshair" : (draggingMap ? "grabbing" : "grab")
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >

          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "top left",
              position: "relative"
            }}
            onDrop={handleDrop}
            onDragOver={allowDrop}
          >

            <img
              src={floorImages[floor]}
              alt="Floor"
              style={{ width: "800px" }}
              onClick={handleMapClick}
            />

            {visiblePCs.map(pc => {
              const isMatch =
                pc.hostname.toLowerCase().includes(search.toLowerCase()) ||
                (selectedPC && selectedPC.id === pc.id);

              return (
                <PcMarker
                  key={pc.id}
                  x={pc.x_position}
                  y={pc.y_position}
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
    </div>
  );
}

export default FloorMap;
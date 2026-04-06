import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";
import Sidebar from "./Sidebar";

function FloorMap() {

  const [pcs, setPcs] = useState([]);
  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("Floor 1");
  const [addMode, setAddMode] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    hostname: "",
    ip_address: "",
    desk_id: "",
    os: "",
    ram: "",
    maker: "",
    age: "",
    status: "online"
  });

  const floorImages = {
    "Floor 1": "/floor1.png",
    "Floor 2": "/floor2.png",
    "Floor 3": "/floor3.png"
  };

  const GRID_SIZE = 20;
  const SNAP_THRESHOLD = 6;

  const snapToGrid = (value) => {
    const nearest = Math.round(value / GRID_SIZE) * GRID_SIZE;
    return Math.abs(value - nearest) <= SNAP_THRESHOLD ? nearest : value;
  };

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
    if (e.target.closest(".pc-marker")) return;
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

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/pcs");
    const data = await res.json();
    setPcs(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const visiblePCs = pcs.filter(pc => pc.floor === floor);

  const total = visiblePCs.length;
  const online = visiblePCs.filter(pc => pc.status === "online").length;
  const offline = visiblePCs.filter(pc => pc.status === "offline").length;
  const oldDevices = visiblePCs.filter(pc => Number(pc.age) > 5).length;

  const handleDeleteFromSidebar = async (id) => {
    await fetch(`http://localhost:5000/api/pcs/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  const handleAddFromSidebar = async (device) => {
    const newPC = {
      ...device,
      status: device.status || "online",
      x_position: 100,
      y_position: 100,
      floor: floor
    };

    await fetch("http://localhost:5000/api/pcs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPC)
    });

    fetchData();
  };

  const handleUpdateFromSidebar = async (id, data) => {
    await fetch(`http://localhost:5000/api/pcs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    fetchData();
  };

  // ===============================
  // ✅ DRAG & DROP RESTORED
  // ===============================
  const handleDrop = async (e) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();

    const x = snapToGrid((e.clientX - rect.left - position.x) / scale);
    const y = snapToGrid((e.clientY - rect.top - position.y) / scale);

    const pcId = e.dataTransfer.getData("pcId");

    await fetch(`http://localhost:5000/api/pcs/${pcId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x_position: Math.round(x),
        y_position: Math.round(y)
      })
    });

    fetchData();
  };

  const allowDrop = (e) => e.preventDefault();

  // ===============================
  // ADD PC
  // ===============================
  const handleMapClick = (e) => {
    if (!addMode) return;
    if (showForm) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = snapToGrid((e.clientX - rect.left - position.x) / scale);
    const y = snapToGrid((e.clientY - rect.top - position.y) / scale);

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
      x_position: Math.round(clickPosition.x),
      y_position: Math.round(clickPosition.y),
      floor: floor
    };

    await fetch("http://localhost:5000/api/pcs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPC)
    });

    setShowForm(false);
    setAddMode(false);

    setFormData({
      hostname: "",
      ip_address: "",
      desk_id: "",
      os: "",
      ram: "",
      maker: "",
      age: "",
      status: "online"
    });

    fetchData();
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const smartReset = () => {
    if (visiblePCs.length === 0) return;

    const xs = visiblePCs.map(pc => pc.x_position);
    const ys = visiblePCs.map(pc => pc.y_position);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const viewportWidth = 800;
    const viewportHeight = 500;

    const scale = Math.min(
      viewportWidth / (maxX - minX + 100),
      viewportHeight / (maxY - minY + 100)
    );

    const x = viewportWidth / 2 - ((minX + maxX) / 2) * scale;
    const y = viewportHeight / 2 - ((minY + maxY) / 2) * scale;

    setScale(scale);
    setPosition({ x, y });
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar
        pcs={visiblePCs}
        onDelete={handleDeleteFromSidebar}
        onSelect={(pc) => {
          if (selectedPC && selectedPC.id === pc.id) setSelectedPC(null);
          else setSelectedPC(pc);
        }}
        onAdd={handleAddFromSidebar}
        onUpdate={handleUpdateFromSidebar}
        selectedPC={selectedPC}
      />

      <div style={{ padding: "10px" }}>

        {/* DASHBOARD */}
        <div style={{
          marginBottom: "10px",
          padding: "8px",
          background: "#f1f1f1",
          borderRadius: "5px",
          display: "flex",
          gap: "15px"
        }}>
          <div><strong>Total:</strong> {total}</div>
          <div style={{ color: "green" }}>Online: {online}</div>
          <div style={{ color: "red" }}>Offline: {offline}</div>
          <div style={{ color: "orange" }}>Old: {oldDevices}</div>
        </div>

        {/* CONTROLS */}
        <div style={{ marginBottom: "10px" }}>
          <select value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option>Floor 1</option>
            <option>Floor 2</option>
            <option>Floor 3</option>
          </select>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedPC(null);
            }}
            style={{ marginLeft: "10px" }}
          />

          <button onClick={() => setAddMode(!addMode)} style={{ marginLeft: "10px" }}>
            {addMode ? "Click map to place PC" : "Add PC"}
          </button>

          <button onClick={resetView} style={{ marginLeft: "10px" }}>
            Reset Layout
          </button>

          <button onClick={smartReset} style={{ marginLeft: "5px" }}>
            Focus Devices
          </button>
        </div>

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
          onMouseLeave={handleMouseUp}
          onClick={handleMapClick}
        >

          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "top left",
              position: "relative"
            }}
            onDrop={handleDrop}           // ✅ RESTORED
            onDragOver={allowDrop}        // ✅ RESTORED
          >

            <img src={floorImages[floor]} alt="Floor" style={{ width: "800px" }} />

            {showForm && (
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  left: clickPosition.x,
                  top: clickPosition.y,
                  background: "white",
                  padding: "10px",
                  border: "1px solid black",
                  zIndex: 10000
                }}
              >
                <form onSubmit={handleSubmit}>
                  <input name="hostname" placeholder="Hostname" onChange={handleChange} required /><br />
                  <input name="ip_address" placeholder="IP Address" onChange={handleChange} required /><br />
                  <input name="desk_id" placeholder="Desk" onChange={handleChange} required /><br />

                  <select name="status" onChange={handleChange} defaultValue="online">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select><br />

                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
              </div>
            )}

            {visiblePCs.map(pc => (
              <PcMarker
                key={pc.id}
                x={pc.x_position}
                y={pc.y_position}
                status={pc.status}
                pc={pc}
                refresh={fetchData}
              />
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default FloorMap;
import React, { useState } from "react";

function Sidebar({ pcs, onDelete, onSelect, onAdd, onUpdate, selectedPC }) {

  const [search, setSearch] = useState("");

  const [newDevice, setNewDevice] = useState({
    hostname: "",
    ip_address: "",
    desk_id: "",
    os: "",
    ram: "",
    maker: "",
    age: "",
    status: "online"
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ===============================
  // FILTER
  // ===============================
  const filteredDevices = pcs.filter(pc =>
    pc.hostname.toLowerCase().includes(search.toLowerCase())
  );

  // ===============================
  // ADD DEVICE
  // ===============================
  const handleAdd = () => {
    if (!newDevice.hostname) return;

    onAdd(newDevice);

    setNewDevice({
      hostname: "",
      ip_address: "",
      desk_id: "",
      os: "",
      ram: "",
      maker: "",
      age: "",
      status: "online"
    });
  };

  // ===============================
  // EDIT
  // ===============================
  const startEdit = (pc) => {
    setEditingId(pc.id);
    setEditData(pc);
  };

  const handleUpdate = () => {
    onUpdate(editingId, editData);
    setEditingId(null);
  };

  return (
    <div
      style={{
        width: "260px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        background: "#f9f9f9"
      }}
    >

      <h3>Devices</h3>

      {/* SEARCH */}
      <input
        placeholder="Search device..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* ADD DEVICE */}
      <div style={{ marginBottom: "15px" }}>

        <input
          placeholder="Hostname"
          value={newDevice.hostname}
          onChange={(e) =>
            setNewDevice({ ...newDevice, hostname: e.target.value })
          }
        />

        <input
          placeholder="IP Address"
          value={newDevice.ip_address}
          onChange={(e) =>
            setNewDevice({ ...newDevice, ip_address: e.target.value })
          }
        />

        <input
          placeholder="Desk"
          value={newDevice.desk_id}
          onChange={(e) =>
            setNewDevice({ ...newDevice, desk_id: e.target.value })
          }
        />

        <input
          placeholder="OS"
          value={newDevice.os}
          onChange={(e) =>
            setNewDevice({ ...newDevice, os: e.target.value })
          }
        />

        <input
          placeholder="RAM"
          value={newDevice.ram}
          onChange={(e) =>
            setNewDevice({ ...newDevice, ram: e.target.value })
          }
        />

        <input
          placeholder="Maker"
          value={newDevice.maker}
          onChange={(e) =>
            setNewDevice({ ...newDevice, maker: e.target.value })
          }
        />

        <input
          placeholder="Age"
          type="number"
          value={newDevice.age}
          onChange={(e) =>
            setNewDevice({ ...newDevice, age: e.target.value })
          }
        />

        <select
          value={newDevice.status}
          onChange={(e) =>
            setNewDevice({ ...newDevice, status: e.target.value })
          }
          style={{ width: "100%", marginTop: "5px" }}
        >
          <option value="online">🟢 Online</option>
          <option value="offline">🔴 Offline</option>
        </select>

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            marginTop: "5px",
            background: "#333",
            color: "white"
          }}
        >
          Add Device
        </button>
      </div>

      {/* DEVICE LIST */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {filteredDevices.map(pc => {

          const isSelected = selectedPC && selectedPC.id === pc.id;

          return (
            <div
              key={pc.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "8px",
                background: isSelected ? "#d0ebff" : "transparent"
              }}
            >

              {editingId === pc.id ? (
                <>
                  <input
                    value={editData.hostname}
                    onChange={(e) =>
                      setEditData({ ...editData, hostname: e.target.value })
                    }
                  />

                  <input
                    value={editData.ip_address}
                    onChange={(e) =>
                      setEditData({ ...editData, ip_address: e.target.value })
                    }
                  />

                  <input
                    value={editData.desk_id}
                    onChange={(e) =>
                      setEditData({ ...editData, desk_id: e.target.value })
                    }
                  />

                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <option value="online">🟢 Online</option>
                    <option value="offline">🔴 Offline</option>
                  </select>

                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {/* HEADER */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{pc.status === "online" ? "🟢" : "🔴"}</span>

                    <strong
                      onClick={() => onSelect(pc)}
                      style={{ cursor: "pointer" }}
                    >
                      {pc.hostname}
                    </strong>
                  </div>

                  {/* FULL INFO */}
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    IP: {pc.ip_address || "N/A"}<br />
                    Desk: {pc.desk_id || "N/A"}<br />
                    OS: {pc.os || "N/A"}<br />
                    RAM: {pc.ram || "N/A"}<br />
                    Maker: {pc.maker || "N/A"}<br />
                    Age: {pc.age ? pc.age + " yrs" : "N/A"}
                  </div>

                  {/* ACTIONS */}
                  <div style={{ marginTop: "5px" }}>
                    <button onClick={() => startEdit(pc)}>Edit</button>
                    <button onClick={() => onDelete(pc.id)}>Delete</button>
                  </div>
                </>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Sidebar;
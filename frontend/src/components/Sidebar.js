import React, { useState } from "react";

function Sidebar({ pcs, onDelete, onSelect, onAdd, onUpdate }) {

  // ===============================
  // STATE
  // ===============================
  const [search, setSearch] = useState("");

  const [newDevice, setNewDevice] = useState({
    hostname: "",
    ip_address: "",
    desk_id: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ===============================
  // FILTER DEVICES
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
      desk_id: ""
    });
  };

  // ===============================
  // START EDIT
  // ===============================
  const startEdit = (pc) => {
    setEditingId(pc.id);
    setEditData(pc);
  };

  // ===============================
  // SAVE EDIT
  // ===============================
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

      {/* TITLE */}
      <h3 style={{ marginBottom: "10px" }}>Devices</h3>

      {/* SEARCH */}
      <input
        placeholder="Search device..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "5px"
        }}
      />

      {/* ADD DEVICE */}
      <div style={{ marginBottom: "15px" }}>

        <input
          placeholder="Hostname"
          value={newDevice.hostname}
          onChange={(e) =>
            setNewDevice({ ...newDevice, hostname: e.target.value })
          }
          style={{ width: "100%", marginBottom: "5px" }}
        />

        <input
          placeholder="IP Address"
          value={newDevice.ip_address}
          onChange={(e) =>
            setNewDevice({ ...newDevice, ip_address: e.target.value })
          }
          style={{ width: "100%", marginBottom: "5px" }}
        />

        <input
          placeholder="Desk"
          value={newDevice.desk_id}
          onChange={(e) =>
            setNewDevice({ ...newDevice, desk_id: e.target.value })
          }
          style={{ width: "100%", marginBottom: "5px" }}
        />

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "5px",
            background: "#333",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Add Device
        </button>

      </div>

      {/* DEVICE LIST */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {filteredDevices.map(pc => (

          <div
            key={pc.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "8px"
            }}
          >

            {editingId === pc.id ? (
              <>
                <input
                  value={editData.hostname}
                  onChange={(e) =>
                    setEditData({ ...editData, hostname: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <input
                  value={editData.ip_address}
                  onChange={(e) =>
                    setEditData({ ...editData, ip_address: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <input
                  value={editData.desk_id}
                  onChange={(e) =>
                    setEditData({ ...editData, desk_id: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />

                <button onClick={handleUpdate} style={{ marginRight: "5px" }}>
                  Save
                </button>

                <button onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* 🔥 STATUS + CLICKABLE ROW */}
                <div
                  onClick={() => onSelect(pc)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    marginBottom: "4px"
                  }}
                >

                  {/* STATUS DOT */}
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: pc.status === "online" ? "green" : "red"
                    }}
                  />

                  <strong>{pc.hostname}</strong>

                </div>

                <small>{pc.ip_address}</small>

                <br />

                {/* ACTIONS */}
                <button
                  onClick={() => startEdit(pc)}
                  style={{ marginRight: "5px" }}
                >
                  Edit
                </button>

                <button onClick={() => onDelete(pc.id)}>
                  Delete
                </button>
              </>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Sidebar;
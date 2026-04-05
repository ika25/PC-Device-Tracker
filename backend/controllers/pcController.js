const pool = require("../db");

// ===============================
// GET ALL PCs
// ===============================
exports.getAllPCs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pcs");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ===============================
// ADD PC
// ===============================
exports.addPC = async (req, res) => {
  const { hostname, ip_address, desk_id, x_position, y_position, status } = req.body;

  try {
    await pool.query(
      "INSERT INTO pcs(hostname, ip_address, desk_id, x_position, y_position, status) VALUES ($1,$2,$3,$4,$5,$6)",
      [hostname, ip_address, desk_id, x_position, y_position, status]
    );

    res.send("PC added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding PC");
  }
};

// ===============================
// UPDATE LOCATION
// ===============================
exports.updateLocation = async (req, res) => {

  const { id } = req.params;
  const { x_position, y_position } = req.body;

  try {

    await pool.query(
      "UPDATE pcs SET x_position=$1, y_position=$2 WHERE id=$3",
      [x_position, y_position, id]
    );

    res.send("Location updated");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating location");
  }
};
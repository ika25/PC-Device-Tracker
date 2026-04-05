const pool = require("../db");

// Get all PCs
exports.getAllPCs = async (req, res) => {

    try {

        // Query database
        const result = await pool.query("SELECT * FROM pcs");

        // Send data to frontend
        res.json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).send("Server error");

    }

};

// Add PC
exports.addPC = async (req, res) => {

    const { hostname, ip_address, desk_id } = req.body;

    try {

        await pool.query(
            "INSERT INTO pcs(hostname, ip_address, desk_id) VALUES ($1,$2,$3)",
            [hostname, ip_address, desk_id]
        );

        res.send("PC added");

    } catch (err) {

        res.status(500).send(err);

    }

};
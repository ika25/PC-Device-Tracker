import React, { useEffect, useState } from "react";
import PcMarker from "./PcMarker";

function FloorMap() {

    const [pcs, setPcs] = useState([]);

    // Fetch PC data from backend
    useEffect(() => {

        fetch("http://localhost:5000/api/pcs")
        .then(res => res.json())
        .then(data => setPcs(data));

    }, []);

    return (

        <div className="map-container">

            {/* Floor plan image */}
            <img
                src="/floorplan.png"
                alt="Office Floor"
                className="floor-map"
            />

            {/* Render PC markers */}
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
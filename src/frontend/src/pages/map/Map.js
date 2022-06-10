import React, { useEffect, useState, useRef } from "react";
import * as tMaps from "@tomtom-international/web-sdk-maps";
import * as tServices from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./map.css";
import Panel from "../../components/Panel";

function Map() {
  const [map, setMap] = useState(null);

  const mapElement = useRef();

  useEffect(() => {
    let map = tMaps.map({
      key: "I6kBz902v7AXAGvD9J7DNysPz9DkfQMP",
      container: mapElement.current,
      center: [0.1378, 35.3944],
      zoom: 8,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
    });
    setMap(map);
  }, []);

  return (
    <>
      {map && <Panel map={map} />}
      <div ref={mapElement} className="map"></div>
    </>
  );
}

export default Map;

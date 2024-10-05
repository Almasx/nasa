"use client";

import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";

interface FarmerArea {
  id: number;
  paths: google.maps.LatLngLiteral[];
}

const FarmerAreaMap: React.FC = () => {
  const [areas, setAreas] = useState<FarmerArea[]>([]);
  const mapRef = useRef<google.maps.Map>();

  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const center = {
    lat: 0,
    lng: 0,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAe4NmaMMKmVwPzjmjSwcKCbQCXv-n9bsU",
    libraries: ["drawing", "geometry"],
  });
  if (!isLoaded) {
    return null;
  }

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    const paths = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

    setAreas((prevAreas) => [...prevAreas, { id: Date.now(), paths }]);

    polygon.setMap(null);
  };

  return (
    <GoogleMap
      onLoad={onLoad}
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={3}
    >
      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: "#2196F3",
            strokeColor: "#2196F3",
            fillOpacity: 0.5,
            strokeWeight: 2,
            zIndex: 1,
          },
        }}
      />
      {areas.map((area) => (
        <Polygon
          key={area.id}
          paths={area.paths}
          options={{
            fillColor: "#2196F3",
            strokeColor: "#2196F3",
            fillOpacity: 0.5,
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default FarmerAreaMap;

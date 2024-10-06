"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { useModalStore } from "~/lib/store/modal-store";
import { useLandStore } from "~/lib/store/land-store";
import { CREATE_FIELD_MODAL_KEY } from "../fields/create-field";
import { useLandMonitoring } from "~/lib/agro-monitoring/hooks";
import { useViewStore } from "~/lib/store/view-store";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxtYXNzYXBhciIsImEiOiJjbTF3eGlwcWYwcGZvMmtwd3pzdWw2N2hwIn0.L8U57_3irFXNEUMAH7MiYA";

const MapBox: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  const { isDrawingMode, selectedLand, setDrawingMode, clearSelectedLand } =
    useLandStore();
  const {
    viewParameters: { mode },
  } = useViewStore();

  const { openModal } = useModalStore();
  const sateliteData = useLandMonitoring();

  const initializeMap = useCallback(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-121, 37],
      zoom: 12,
    });

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
    });

    mapRef.current.addControl(drawRef.current);
  }, []);

  const handleDrawingModeChange = useCallback(() => {
    if (!mapRef.current || !drawRef.current) return;

    if (isDrawingMode) {
      drawRef.current.changeMode("draw_polygon");
      mapRef.current.getCanvas().style.cursor = "crosshair";
    } else {
      drawRef.current.changeMode("simple_select");
      mapRef.current.getCanvas().style.cursor = "";
    }
  }, [isDrawingMode]);

  const handleFieldCreation = useCallback(() => {
    if (!drawRef.current) return;

    const data = drawRef.current.getAll();
    if (data.features.length === 0) return;

    const areaInHectars = Math.round(turf.area(data) * 100) / 10010000;
    if (areaInHectars < 1) return;

    openModal(
      CREATE_FIELD_MODAL_KEY,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).features[0].geometry.coordinates[0]
    );
    setDrawingMode(false);
    clearSelectedLand();
  }, [openModal, setDrawingMode, clearSelectedLand]);

  const setupNDVI = useCallback(() => {
    if (!mapRef.current || !selectedLand?.coordinates || mode !== "nvdi")
      return;
    console.log(selectedLand.coordinates.slice(0, 4));

    const data = {
      type: "image",
      url: sateliteData?.image?.ndvi,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      coordinates: selectedLand.coordinates.slice(0, 4) as any,
    } as const;

    if (!mapRef.current.getSource("ndvi")) {
      mapRef.current.on("load", () => {
        mapRef.current?.addSource("ndvi", data);

        mapRef.current?.addLayer({
          id: "ndvi-layer",
          type: "raster",
          source: "ndvi",
          paint: { "raster-fade-duration": 0 },
        });
      });

      return;
    }
    mapRef.current.getSource("ndvi")!.setData(data);
  }, [sateliteData, selectedLand, mode]);

  const setupEventListeners = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.on("draw.create", handleFieldCreation);
    mapRef.current.on("click", clearSelectedLand);

    return () => {
      mapRef.current?.off("draw.create", handleFieldCreation);
      mapRef.current?.off("click", clearSelectedLand);
    };
  }, [handleFieldCreation, clearSelectedLand]);

  const displaySelectedLand = useCallback(() => {
    if (!drawRef.current || !selectedLand) return;

    drawRef.current.set({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [selectedLand.coordinates],
          },
        },
      ],
    });
  }, [selectedLand]);

  useEffect(() => {
    initializeMap();
    return () => mapRef.current?.remove();
  }, [initializeMap]);

  useEffect(() => {
    handleDrawingModeChange();
  }, [handleDrawingModeChange]);

  useEffect(() => {
    return setupEventListeners();
  }, [setupEventListeners]);

  useEffect(() => {
    setupNDVI();
  }, [setupNDVI]);

  useEffect(() => {
    displaySelectedLand();
  }, [displaySelectedLand]);

  return <div ref={mapContainerRef} id="map" style={{ height: "100%" }} />;
};

export default MapBox;

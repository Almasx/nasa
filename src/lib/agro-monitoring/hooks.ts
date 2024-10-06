import { useQuery } from "@tanstack/react-query";
import { getAgroMonitoringData } from ".";
import { useLandStore } from "../store/land-store";
import { useViewStore } from "../store/view-store";
import React from "react";

export function useLandMonitoring() {
  const { selectedLand, setData } = useLandStore();
  const { currentDate } = useViewStore();

  const { data } = useQuery({
    queryKey: ["satelite"],
    queryFn: () =>
      getAgroMonitoringData(
        selectedLand!.coordinates.map((coord) => ({
          lat: coord.at(0)!,
          lng: coord.at(-1)!,
        })),
        currentDate.toISOString(),
        "almas"
      ),

    enabled: !!selectedLand?.coordinates,
  });

  React.useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  return data;
}

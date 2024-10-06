import { useQuery } from "@tanstack/react-query";
import { getAgroMonitoringData } from ".";
import { useLandStore } from "../store/land-store";
import { useViewStore } from "../store/view-store";

export function useLandMonitoring() {
  const { selectedLand } = useLandStore();
  const { currentDate } = useViewStore();

  const { data } = useQuery({
    queryKey: ["satelite", selectedLand?.name],
    queryFn: () =>
      getAgroMonitoringData(selectedLand!.polygonId, currentDate.toISOString()),

    enabled: !!selectedLand,
    staleTime: Infinity,
  });

  return data;
}

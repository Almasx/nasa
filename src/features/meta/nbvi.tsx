"use client";

import { useLandMonitoring } from "~/lib/agro-monitoring/hooks";

export const NBVI = () => {
  const data = useLandMonitoring();

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl overflow-hidden p-1 gap-1 grid grid-cols-3">
      <div className="px-4 py-1 text-sm text-center rounded-lg duration-200 hover:bg-neutral-700/80 bg-neutral-800/80 flex flex-col">
        <p className="uppercase font-mono text-sm text-neutral-400 mb-0.5">
          TO
        </p>
        {/* <p>{data?.meta?.at(0)}</p> */}
      </div>
      <div className="px-4 py-1 text-sm text-center rounded-lg duration-200 hover:bg-neutral-700/80 bg-neutral-800/80 flex flex-col">
        <p className="uppercase font-mono text-sm text-neutral-400 mb-0.5">
          TMAX
        </p>
        <p>tmax</p>
      </div>
      <div className="px-4 py-1 text-sm text-center rounded-lg duration-200 hover:bg-neutral-700/80 bg-neutral-800/80 flex flex-col">
        <p className="uppercase font-mono text-sm text-neutral-400 mb-0.5">
          TMEDIAN
        </p>
        <p>tmedian</p>
      </div>
    </div>
  );
};

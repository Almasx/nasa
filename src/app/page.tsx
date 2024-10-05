import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("~/components/map"), { ssr: false });

const Home: NextPage = () => {
  return (
    <div>
      <h1>Land Area Selection Map</h1>
      <Map />
    </div>
  );
};

export default Home;

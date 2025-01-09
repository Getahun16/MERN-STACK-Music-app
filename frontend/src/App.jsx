import { useContext } from "react";

import Display from "./components/Display";
import Sidebar from "./components/Sidebar";
import { PlayerContext } from "./context/PlayerContext";
import AudioPlayer from "./components/AudioPlayer";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);
  return (
    <div className=" h-screen bg-black">
      {songsData.length !== 0 ? (
        <>
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
        </>
      ) : null}

      <AudioPlayer />
      <audio
        ref={audioRef}
        preload="auto"
        src={track ? track.file : ""}
      ></audio>
    </div>
  );
};
export default App;

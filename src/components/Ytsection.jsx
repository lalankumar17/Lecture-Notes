import { useEffect, useRef } from 'react';
import { useNoteStore } from '../store/useNotes'

const YOUTUBE_IFRAME_API_URL = "https://www.youtube.com/iframe_api";
const YOUTUBE_IFRAME_API_ID = "youtube-iframe-api";

const loadYouTubeIframeApi = () => {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById(YOUTUBE_IFRAME_API_ID);

    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = YOUTUBE_IFRAME_API_ID;
      tag.src = YOUTUBE_IFRAME_API_URL;
      document.body.appendChild(tag);
    }

    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      resolve(window.YT);
    };
  });
};

const Ytsection = () => {
  const playerRef = useRef(null);
  const { setPlayer, videoId } = useNoteStore();

  useEffect(() => {
    const nextVideoId = videoId || localStorage.getItem("videoId");

    if (!nextVideoId || !playerRef.current) {
      return undefined;
    }

    let player;
    let isDisposed = false;

    loadYouTubeIframeApi().then(() => {
      if (isDisposed || !playerRef.current || !window.YT?.Player) {
        return;
      }

      player = new window.YT.Player(playerRef.current, {
        height: "52vh",
        width: "100%",
        videoId: nextVideoId,
      });
      setPlayer(player);
    });

    return () => {
      isDisposed = true;
      if (typeof player?.destroy === "function") {
        player.destroy();
      }
      setPlayer(null);
    };
  }, [setPlayer, videoId]);

  return <div style={{height:"52vh",width:"100%"}} ref={playerRef}></div>;
};

export default Ytsection

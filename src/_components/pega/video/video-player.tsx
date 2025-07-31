import ReactPlayer from "react-player";
import { cn } from "~/lib/utils";

interface VideoPlayerProps {
  // Define any props you need for the video player
  className?: string;
  videoSrc?: string; // Optional video source URL
  caption?: string; // Optional caption for the video
  controls?: boolean; // Optional prop to control video playback controls
  autoPlay?: boolean; // Optional prop to enable autoplay
  loop?: boolean; // Optional prop to enable looping
  muted?: boolean; // Optional prop to enable muted playback
  poster?: string; // Optional poster image for the video
}

function VideoPlayer(props: VideoPlayerProps) {
  const src =
    props.videoSrc ??
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  return (
    <div className="">
      <ReactPlayer
        src={src}
        controls={props.controls}
        className={cn(props.className, "rounded-2xl shadow-lg")}
        style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      />
    </div>
  );
}

export default VideoPlayer;

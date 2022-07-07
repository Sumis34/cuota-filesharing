import Wave from "react-wavify";

interface UploadLoadingPanelProps {
  progress: number;
}

export default function UploadLoadingPanel({
  progress,
}: UploadLoadingPanelProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 overflow-hidden rounded-full aspect-square bg-gray-200">
        <Wave
          fill="url(#gradient)"
          options={{
            height: 0,
            amplitude: 20,
            speed: 0.2,
            points: 3,
          }}
          seed={10}
          style={{
            position: "relative",
            top: "30%",
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor="#a5b4fc" />
              <stop offset="90%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </Wave>
      </div>
    </div>
  );
}

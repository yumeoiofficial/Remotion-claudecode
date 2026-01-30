import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const AbcdefgAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "abcdefg".split("");
  const framesPerLetter = Math.floor((6 * fps) / letters.length); // 6秒を7文字で分割

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: 20,
      }}
    >
      {letters.map((letter, index) => {
        const letterStartFrame = index * framesPerLetter;

        // Spring animation for scale
        const scale = spring({
          frame: frame - letterStartFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        // Opacity animation
        const opacity = interpolate(
          frame,
          [letterStartFrame, letterStartFrame + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Y position animation (bounce in from top)
        const translateY = interpolate(
          spring({
            frame: frame - letterStartFrame,
            fps,
            config: { damping: 15 },
          }),
          [0, 1],
          [-100, 0]
        );

        // Color animation
        const hue = (index * 50 + frame * 2) % 360;

        return (
          <div
            key={index}
            style={{
              fontSize: 120,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              color: `hsl(${hue}, 80%, 60%)`,
              opacity,
              transform: `scale(${scale}) translateY(${translateY}px)`,
              textShadow: `0 0 20px hsl(${hue}, 80%, 50%)`,
            }}
          >
            {letter}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

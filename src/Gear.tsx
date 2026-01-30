import React from "react";

interface GearProps {
  size: number;
  color: string;
  rotation: number;
  teeth?: number;
}

export const Gear: React.FC<GearProps> = ({
  size,
  color,
  rotation,
  teeth = 12,
}) => {
  const toothWidth = size * 0.12;
  const toothHeight = size * 0.15;
  const innerRadius = size * 0.35;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* 歯車の歯 */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (360 / teeth) * i;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: toothWidth,
              height: toothHeight,
              backgroundColor: color,
              left: "50%",
              top: "50%",
              marginLeft: -toothWidth / 2,
              marginTop: -size / 2,
              transformOrigin: `50% ${size / 2}px`,
              transform: `rotate(${angle}deg)`,
              borderRadius: 4,
            }}
          />
        );
      })}
      {/* 歯車の本体（外側） */}
      <div
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: "50%",
          backgroundColor: color,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* 歯車の穴（内側） */}
      <div
        style={{
          position: "absolute",
          width: innerRadius * 2,
          height: innerRadius * 2,
          borderRadius: "50%",
          backgroundColor: "#0a0a0a",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: `${size * 0.05}px solid ${color}`,
        }}
      />
      {/* 中心の軸 */}
      <div
        style={{
          position: "absolute",
          width: size * 0.15,
          height: size * 0.15,
          borderRadius: "50%",
          backgroundColor: color,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

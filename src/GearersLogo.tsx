import React from "react";

interface GearersLogoProps {
  size?: number;
  showText?: boolean;
}

export const GearersLogo: React.FC<GearersLogoProps> = ({
  size = 400,
  showText = true,
}) => {
  const gearColor = "#1a5a9c";
  const grayColor = "#6b7280";
  const textColor = "#2d3748";

  const gearRadius = size * 0.4;
  const teeth = 18;
  const toothHeight = size * 0.06;
  const toothWidth = size * 0.04;

  // 歯車の歯を生成
  const renderTeeth = (isTop: boolean) => {
    const teethElements = [];
    const startAngle = isTop ? 180 : 0;
    const endAngle = isTop ? 360 : 180;

    for (let i = 0; i < teeth; i++) {
      const angle = (360 / teeth) * i;
      if (
        (isTop && angle >= startAngle - 20 && angle <= endAngle + 20) ||
        (!isTop && (angle <= endAngle + 20 || angle >= startAngle + 340))
      ) {
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * gearRadius;
        const y = Math.sin(radians) * gearRadius;

        teethElements.push(
          <rect
            key={i}
            x={-toothWidth / 2}
            y={-gearRadius - toothHeight}
            width={toothWidth}
            height={toothHeight}
            fill={gearColor}
            transform={`rotate(${angle})`}
            rx={2}
          />
        );
      }
    }
    return teethElements;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {/* 上半分のギア */}
      <g>
        {/* 歯 */}
        {renderTeeth(true)}
        {/* 本体の円弧（上半分） */}
        <path
          d={`M ${-gearRadius} 0 A ${gearRadius} ${gearRadius} 0 0 1 ${gearRadius} 0`}
          fill="none"
          stroke={gearColor}
          strokeWidth={size * 0.06}
        />
        {/* 内側の円弧 */}
        <path
          d={`M ${-gearRadius * 0.75} 0 A ${gearRadius * 0.75} ${gearRadius * 0.75} 0 0 1 ${gearRadius * 0.75} 0`}
          fill="none"
          stroke={gearColor}
          strokeWidth={size * 0.02}
        />
      </g>

      {/* 下半分のギア */}
      <g>
        {/* 歯 */}
        {renderTeeth(false)}
        {/* 本体の円弧（下半分） */}
        <path
          d={`M ${-gearRadius} 0 A ${gearRadius} ${gearRadius} 0 0 0 ${gearRadius} 0`}
          fill="none"
          stroke={gearColor}
          strokeWidth={size * 0.06}
        />
        {/* 内側の円弧 */}
        <path
          d={`M ${-gearRadius * 0.75} 0 A ${gearRadius * 0.75} ${gearRadius * 0.75} 0 0 0 ${gearRadius * 0.75} 0`}
          fill="none"
          stroke={gearColor}
          strokeWidth={size * 0.02}
        />
      </g>

      {/* 中央のグレーのライン（上） */}
      <path
        d={`M ${-size * 0.45} ${-size * 0.02}
           Q ${-size * 0.2} ${-size * 0.08}, 0 ${-size * 0.08}
           Q ${size * 0.2} ${-size * 0.08}, ${size * 0.45} ${-size * 0.02}`}
        fill="none"
        stroke={grayColor}
        strokeWidth={size * 0.015}
        strokeLinecap="round"
      />

      {/* 中央のグレーのライン（下） */}
      <path
        d={`M ${-size * 0.45} ${size * 0.02}
           Q ${-size * 0.2} ${size * 0.08}, 0 ${size * 0.08}
           Q ${size * 0.2} ${size * 0.08}, ${size * 0.45} ${size * 0.02}`}
        fill="none"
        stroke={grayColor}
        strokeWidth={size * 0.015}
        strokeLinecap="round"
      />

      {/* GEARERSテキスト */}
      {showText && (
        <text
          x={0}
          y={size * 0.02}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontWeight={700}
          fontSize={size * 0.12}
          fill={textColor}
          letterSpacing={size * 0.01}
        >
          GEARERS
        </text>
      )}
    </svg>
  );
};

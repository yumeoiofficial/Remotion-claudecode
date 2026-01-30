import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Gear } from "./Gear";

export const GearersIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // フェーズ1: 歯車が両側から中央へ移動 (0-2秒)
  const gearMoveProgress = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 50 },
    durationInFrames: 2 * fps,
  });

  // フェーズ2: 歯車が重なった後のロゴ出現 (2-3秒)
  const logoDelay = 2 * fps;
  const logoProgress = spring({
    frame: frame - logoDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // フェーズ3: サブテキスト出現 (2.5-3.5秒)
  const subtitleDelay = 2.5 * fps;
  const subtitleProgress = spring({
    frame: frame - subtitleDelay,
    fps,
    config: { damping: 30 },
  });

  // 歯車の位置計算
  const gearSize = 280;
  const startOffsetX = width / 2 + gearSize;
  const endOffsetX = gearSize * 0.3;

  const leftGearX = interpolate(gearMoveProgress, [0, 1], [-startOffsetX, -endOffsetX]);
  const rightGearX = interpolate(gearMoveProgress, [0, 1], [startOffsetX, endOffsetX]);

  // 歯車の回転（移動中に回転）
  const gearRotation = interpolate(frame, [0, 3 * fps], [0, 360]);

  // ロゴのスケールとオパシティ
  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // サブテキストのアニメーション
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  // 歯車の色（アンティークゴールド/ブロンズ）
  const gearColor1 = "#c9a227";
  const gearColor2 = "#b87333";

  // 背景のグラデーション効果
  const bgPulse = interpolate(
    frame,
    [0, fps, 2 * fps, 3 * fps],
    [0, 0.1, 0.2, 0.15],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 背景のビネット効果 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center,
            rgba(201, 162, 39, ${bgPulse}) 0%,
            rgba(10, 10, 10, 1) 70%)`,
        }}
      />

      {/* 背景の装飾ライン */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "2px",
          backgroundColor: `rgba(201, 162, 39, ${0.3 * logoProgress})`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      {/* 左の歯車 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(${leftGearX}px, -50%)`,
        }}
      >
        <Gear
          size={gearSize}
          color={gearColor1}
          rotation={-gearRotation}
          teeth={16}
        />
      </div>

      {/* 右の歯車 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(${rightGearX}px, -50%)`,
        }}
      >
        <Gear
          size={gearSize}
          color={gearColor2}
          rotation={gearRotation}
          teeth={16}
        />
      </div>

      {/* メインロゴ「GEARERS」 */}
      <div
        style={{
          position: "absolute",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "Arial Black, sans-serif",
            fontSize: 120,
            fontWeight: 900,
            color: "#fff",
            textShadow: `
              0 0 20px rgba(201, 162, 39, 0.8),
              0 0 40px rgba(201, 162, 39, 0.6),
              0 0 60px rgba(201, 162, 39, 0.4),
              2px 2px 0 #c9a227,
              -2px -2px 0 #b87333
            `,
            letterSpacing: "0.15em",
            margin: 0,
          }}
        >
          GEARERS
        </h1>
      </div>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          top: "62%",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            color: "#c9a227",
            letterSpacing: "0.5em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Video Generation
        </p>
      </div>

      {/* スパーク/パーティクル効果 */}
      {frame > logoDelay &&
        Array.from({ length: 8 }).map((_, i) => {
          const particleProgress = spring({
            frame: frame - logoDelay - i * 2,
            fps,
            config: { damping: 15 },
          });
          const angle = (360 / 8) * i;
          const distance = interpolate(particleProgress, [0, 1], [0, 150]);
          const particleOpacity = interpolate(
            particleProgress,
            [0, 0.3, 1],
            [0, 1, 0]
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#c9a227",
                boxShadow: "0 0 10px #c9a227",
                opacity: particleOpacity,
                transform: `rotate(${angle}deg) translateY(-${distance}px)`,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};

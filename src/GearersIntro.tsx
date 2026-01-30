import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";
import { Gear } from "./Gear";

export const GearersIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // === タイミング定義 ===
  const gearMoveEnd = 2 * fps; // 歯車移動完了
  const flashTime = 2 * fps; // フラッシュタイミング
  const logoStart = 2.2 * fps; // ロゴ開始
  const subtitleStart = 3 * fps;

  // === 歯車アニメーション ===
  const gearMoveProgress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 40 },
    durationInFrames: gearMoveEnd,
  });

  // 3D風: 歯車が奥から手前に来る
  const gearScale = interpolate(gearMoveProgress, [0, 1], [0.3, 1], {
    extrapolateRight: "clamp",
  });

  // 歯車サイズ（大きく！）
  const gearSize = 450;
  const startOffsetX = width / 2 + gearSize;
  const endOffsetX = gearSize * 0.35;

  const leftGearX = interpolate(gearMoveProgress, [0, 1], [-startOffsetX, -endOffsetX]);
  const rightGearX = interpolate(gearMoveProgress, [0, 1], [startOffsetX, endOffsetX]);

  // 歯車の回転
  const gearRotation = interpolate(frame, [0, 4 * fps], [0, 720]);

  // === フラッシュ演出 ===
  const flashProgress = interpolate(
    frame,
    [flashTime, flashTime + 5, flashTime + 15],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === ロゴアニメーション（文字バラバラ出現） ===
  const logoText = "GEARERS";
  const letterDelay = 3; // フレーム間隔

  // === グリッチエフェクト ===
  const glitchActive = frame > logoStart && frame < logoStart + fps * 0.5;
  const glitchOffset = glitchActive ? Math.sin(frame * 10) * 5 : 0;
  const glitchColor = glitchActive && Math.random() > 0.7;

  // === 背景グリッド ===
  const gridOffset = (frame * 2) % 50;

  // === ネオングロー パルス ===
  const glowPulse = interpolate(
    frame,
    [logoStart, logoStart + fps, logoStart + fps * 2],
    [0.5, 1, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // サブテキスト
  const subtitleProgress = spring({
    frame: frame - subtitleStart,
    fps,
    config: { damping: 30 },
  });

  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 歯車の色
  const gearColor1 = "#c9a227";
  const gearColor2 = "#b87333";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050508",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 背景グリッド */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
          backgroundImage: `
            linear-gradient(rgba(201, 162, 39, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 162, 39, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translateY(${gridOffset}px)`,
          opacity: 0.5,
        }}
      />

      {/* 放射状グラデーション */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center,
            rgba(201, 162, 39, ${0.15 * glowPulse}) 0%,
            rgba(5, 5, 8, 1) 60%)`,
        }}
      />

      {/* 左の歯車 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(${leftGearX}px, -50%) scale(${gearScale})`,
          filter: `drop-shadow(0 0 30px rgba(201, 162, 39, 0.6))`,
        }}
      >
        <Gear
          size={gearSize}
          color={gearColor1}
          rotation={-gearRotation}
          teeth={20}
        />
      </div>

      {/* 右の歯車 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(${rightGearX}px, -50%) scale(${gearScale})`,
          filter: `drop-shadow(0 0 30px rgba(184, 115, 51, 0.6))`,
        }}
      >
        <Gear
          size={gearSize}
          color={gearColor2}
          rotation={gearRotation}
          teeth={20}
        />
      </div>

      {/* フラッシュ */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          opacity: flashProgress * 0.9,
          pointerEvents: "none",
        }}
      />

      {/* メインロゴ「GEARERS」- 文字バラバラ出現 + グリッチ */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          zIndex: 10,
          transform: `translateX(${glitchOffset}px)`,
        }}
      >
        {logoText.split("").map((letter, i) => {
          const letterProgress = spring({
            frame: frame - logoStart - i * letterDelay,
            fps,
            config: { damping: 12, stiffness: 150 },
          });

          const letterScale = interpolate(letterProgress, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const letterOpacity = interpolate(letterProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });
          const letterY = interpolate(letterProgress, [0, 1], [-100, 0], {
            extrapolateRight: "clamp",
          });
          const letterRotate = interpolate(letterProgress, [0, 1], [45, 0], {
            extrapolateRight: "clamp",
          });

          // グリッチカラー
          const glitchR = glitchColor && i % 3 === 0 ? 3 : 0;
          const glitchB = glitchColor && i % 3 === 1 ? -3 : 0;

          return (
            <span
              key={i}
              style={{
                fontFamily: "Arial Black, Impact, sans-serif",
                fontSize: 140,
                fontWeight: 900,
                color: "#fff",
                textShadow: `
                  0 0 ${20 * glowPulse}px rgba(201, 162, 39, 1),
                  0 0 ${40 * glowPulse}px rgba(201, 162, 39, 0.8),
                  0 0 ${60 * glowPulse}px rgba(201, 162, 39, 0.6),
                  0 0 ${80 * glowPulse}px rgba(201, 162, 39, 0.4),
                  ${glitchR}px 0 0 rgba(255, 0, 0, 0.7),
                  ${glitchB}px 0 0 rgba(0, 255, 255, 0.7),
                  3px 3px 0 #c9a227,
                  -1px -1px 0 #b87333
                `,
                letterSpacing: "0.08em",
                opacity: letterOpacity,
                transform: `translateY(${letterY}px) scale(${letterScale}) rotate(${letterRotate}deg)`,
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          top: "64%",
          opacity: subtitleOpacity,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 28,
            color: "#c9a227",
            letterSpacing: "0.6em",
            margin: 0,
            textTransform: "uppercase",
            textShadow: `
              0 0 10px rgba(201, 162, 39, 0.8),
              0 0 20px rgba(201, 162, 39, 0.5)
            `,
          }}
        >
          Video Generation
        </p>
      </div>

      {/* スパークパーティクル */}
      {frame > flashTime &&
        Array.from({ length: 16 }).map((_, i) => {
          const particleDelay = i * 2;
          const particleProgress = spring({
            frame: frame - flashTime - particleDelay,
            fps,
            config: { damping: 10, stiffness: 80 },
          });

          const angle = (360 / 16) * i + random(`particle-${i}`) * 20;
          const distance = interpolate(particleProgress, [0, 1], [0, 300 + random(`dist-${i}`) * 100]);
          const particleOpacity = interpolate(
            particleProgress,
            [0, 0.2, 1],
            [0, 1, 0]
          );
          const particleSize = 4 + random(`size-${i}`) * 6;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: particleSize,
                height: particleSize,
                borderRadius: "50%",
                backgroundColor: i % 2 === 0 ? "#c9a227" : "#fff",
                boxShadow: `0 0 ${particleSize * 2}px ${i % 2 === 0 ? "#c9a227" : "#fff"}`,
                opacity: particleOpacity,
                transform: `rotate(${angle}deg) translateY(-${distance}px)`,
              }}
            />
          );
        })}

      {/* 水平ライン */}
      {frame > logoStart && (
        <>
          <div
            style={{
              position: "absolute",
              width: `${interpolate(
                frame - logoStart,
                [0, fps * 0.5],
                [0, 100],
                { extrapolateRight: "clamp" }
              )}%`,
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
              top: "42%",
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: `${interpolate(
                frame - logoStart,
                [0, fps * 0.5],
                [0, 100],
                { extrapolateRight: "clamp" }
              )}%`,
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a227, transparent)",
              top: "58%",
              opacity: 0.6,
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};

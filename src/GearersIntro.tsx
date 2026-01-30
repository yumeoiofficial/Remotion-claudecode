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
  const gearMoveEnd = 2 * fps;
  const flashTime = 2 * fps;
  const logoStart = 2.2 * fps;
  const subtitleStart = 3 * fps;

  // === カメラシェイク ===
  const shakeIntensity = frame > flashTime && frame < flashTime + 10 ? 8 : 0;
  const shakeX = shakeIntensity * Math.sin(frame * 50) * random("shakeX");
  const shakeY = shakeIntensity * Math.cos(frame * 50) * random("shakeY");

  // === ズームエフェクト ===
  const zoomProgress = interpolate(
    frame,
    [flashTime, flashTime + 20],
    [1, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const zoomOut = interpolate(
    frame,
    [flashTime + 20, flashTime + 40],
    [1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const zoom = frame < flashTime + 20 ? zoomProgress : zoomOut;

  // === 歯車アニメーション ===
  const gearMoveProgress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 40 },
    durationInFrames: gearMoveEnd,
  });

  const gearScale = interpolate(gearMoveProgress, [0, 1], [0.2, 1], {
    extrapolateRight: "clamp",
  });

  const gearSize = 500;
  const startOffsetX = width / 2 + gearSize;
  const endOffsetX = gearSize * 0.32;

  const leftGearX = interpolate(gearMoveProgress, [0, 1], [-startOffsetX, -endOffsetX]);
  const rightGearX = interpolate(gearMoveProgress, [0, 1], [startOffsetX, endOffsetX]);
  const gearRotation = interpolate(frame, [0, 4 * fps], [0, 900]);

  // === フラッシュ ===
  const flashProgress = interpolate(
    frame,
    [flashTime, flashTime + 3, flashTime + 8, flashTime + 12],
    [0, 1, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === ロゴ ===
  const logoText = "GEARERS";
  const letterDelay = 2;

  // === グリッチ ===
  const glitchActive = frame > logoStart && frame < logoStart + fps * 0.4;
  const glitchOffset = glitchActive ? Math.sin(frame * 15) * 8 : 0;
  const glitchSlice = glitchActive && random(`glitch-${frame}`) > 0.6;

  // === 背景グリッド ===
  const gridOffset = (frame * 3) % 50;

  // === ネオングロー ===
  const glowPulse = interpolate(
    Math.sin(frame * 0.3),
    [-1, 1],
    [0.6, 1.2]
  );

  // === スキャンライン ===
  const scanlineY = (frame * 8) % height;

  // === ビネット強度 ===
  const vignetteIntensity = interpolate(
    frame,
    [0, flashTime, flashTime + 10],
    [0.8, 0.3, 0.6],
    { extrapolateRight: "clamp" }
  );

  // === 回転する光線 ===
  const lightRayRotation = frame * 0.5;

  // === クロマティックアベレーション（色収差） ===
  const chromaOffset = glitchActive ? 4 : 0;

  // サブテキスト
  const subtitleProgress = spring({
    frame: frame - subtitleStart,
    fps,
    config: { damping: 25, stiffness: 120 },
  });

  const gearColor1 = "#c9a227";
  const gearColor2 = "#b87333";

  // === 背景の小さい歯車たち ===
  const bgGears = Array.from({ length: 8 }).map((_, i) => ({
    x: random(`bgGear-x-${i}`) * width,
    y: random(`bgGear-y-${i}`) * height,
    size: 60 + random(`bgGear-size-${i}`) * 100,
    speed: 0.3 + random(`bgGear-speed-${i}`) * 0.7,
    opacity: 0.1 + random(`bgGear-opacity-${i}`) * 0.15,
  }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030305",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* 回転する光線 */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          background: `conic-gradient(
            from ${lightRayRotation}deg,
            transparent 0deg,
            rgba(201, 162, 39, 0.03) 10deg,
            transparent 20deg,
            transparent 90deg,
            rgba(201, 162, 39, 0.03) 100deg,
            transparent 110deg,
            transparent 180deg,
            rgba(201, 162, 39, 0.03) 190deg,
            transparent 200deg,
            transparent 270deg,
            rgba(201, 162, 39, 0.03) 280deg,
            transparent 290deg
          )`,
          transform: "translate(-25%, -25%)",
        }}
      />

      {/* 背景グリッド */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
          backgroundImage: `
            linear-gradient(rgba(201, 162, 39, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 162, 39, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: `translateY(${gridOffset}px) perspective(500px) rotateX(60deg)`,
          opacity: 0.6,
        }}
      />

      {/* 背景の小さい歯車たち */}
      {bgGears.map((gear, i) => (
        <div
          key={`bg-gear-${i}`}
          style={{
            position: "absolute",
            left: gear.x,
            top: gear.y,
            opacity: gear.opacity,
            filter: "blur(2px)",
          }}
        >
          <Gear
            size={gear.size}
            color={i % 2 === 0 ? gearColor1 : gearColor2}
            rotation={frame * gear.speed * (i % 2 === 0 ? 1 : -1)}
            teeth={8 + i}
          />
        </div>
      ))}

      {/* 放射状グラデーション */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center,
            rgba(201, 162, 39, ${0.2 * glowPulse}) 0%,
            rgba(184, 115, 51, 0.1) 30%,
            rgba(3, 3, 5, 1) 70%)`,
        }}
      />

      {/* 電気/稲妻エフェクト */}
      {frame > flashTime - 5 && frame < flashTime + 15 && (
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: interpolate(
              frame,
              [flashTime - 5, flashTime, flashTime + 5, flashTime + 15],
              [0, 1, 0.5, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const startX = width / 2 + (random(`lightning-sx-${i}`) - 0.5) * 100;
            const startY = height / 2;
            const points = Array.from({ length: 8 }).map((_, j) => {
              const x = startX + (random(`l-${i}-${j}-x`) - 0.5) * 300;
              const y = startY + (j - 4) * 50 + (random(`l-${i}-${j}-y`) - 0.5) * 30;
              return `${x},${y}`;
            }).join(" ");

            return (
              <polyline
                key={i}
                points={points}
                fill="none"
                stroke={i % 2 === 0 ? "#c9a227" : "#fff"}
                strokeWidth={2 - i * 0.2}
                opacity={0.6 + random(`l-opacity-${i}`) * 0.4}
              />
            );
          })}
        </svg>
      )}

      {/* 左の歯車 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(${leftGearX}px, -50%) scale(${gearScale})`,
          filter: `drop-shadow(0 0 40px rgba(201, 162, 39, 0.8)) drop-shadow(0 0 80px rgba(201, 162, 39, 0.4))`,
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
          filter: `drop-shadow(0 0 40px rgba(184, 115, 51, 0.8)) drop-shadow(0 0 80px rgba(184, 115, 51, 0.4))`,
        }}
      >
        <Gear
          size={gearSize}
          color={gearColor2}
          rotation={gearRotation}
          teeth={20}
        />
      </div>

      {/* 火花エフェクト（歯車接触部分） */}
      {frame > gearMoveEnd - 10 && frame < flashTime + 30 &&
        Array.from({ length: 12 }).map((_, i) => {
          const sparkFrame = frame - (gearMoveEnd - 10);
          const sparkLife = 20;
          const sparkDelay = i * 2;
          const sparkProgress = Math.min(1, Math.max(0, (sparkFrame - sparkDelay) / sparkLife));

          if (sparkProgress <= 0 || sparkProgress >= 1) return null;

          const angle = random(`spark-angle-${i}`) * 360;
          const distance = sparkProgress * (50 + random(`spark-dist-${i}`) * 100);
          const sparkOpacity = 1 - sparkProgress;

          return (
            <div
              key={`spark-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 4,
                height: 12,
                backgroundColor: "#ffdd44",
                borderRadius: 2,
                boxShadow: "0 0 8px #ffdd44, 0 0 16px #c9a227",
                opacity: sparkOpacity,
                transform: `rotate(${angle}deg) translateY(-${distance}px)`,
              }}
            />
          );
        })}

      {/* フラッシュ */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          opacity: flashProgress,
          mixBlendMode: "overlay",
        }}
      />

      {/* クロマティックアベレーション - 赤 */}
      {chromaOffset > 0 && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            zIndex: 9,
            transform: `translateX(${-chromaOffset}px)`,
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        >
          {logoText.split("").map((letter, i) => {
            const letterProgress = spring({
              frame: frame - logoStart - i * letterDelay,
              fps,
              config: { damping: 12, stiffness: 150 },
            });
            const letterOpacity = interpolate(letterProgress, [0, 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={`r-${i}`}
                style={{
                  fontFamily: "Arial Black, Impact, sans-serif",
                  fontSize: 150,
                  fontWeight: 900,
                  color: "#ff0000",
                  opacity: letterOpacity * 0.7,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      )}

      {/* クロマティックアベレーション - 青 */}
      {chromaOffset > 0 && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            zIndex: 9,
            transform: `translateX(${chromaOffset}px)`,
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        >
          {logoText.split("").map((letter, i) => {
            const letterProgress = spring({
              frame: frame - logoStart - i * letterDelay,
              fps,
              config: { damping: 12, stiffness: 150 },
            });
            const letterOpacity = interpolate(letterProgress, [0, 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={`b-${i}`}
                style={{
                  fontFamily: "Arial Black, Impact, sans-serif",
                  fontSize: 150,
                  fontWeight: 900,
                  color: "#00ffff",
                  opacity: letterOpacity * 0.7,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      )}

      {/* メインロゴ */}
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
            config: { damping: 10, stiffness: 180 },
          });

          const letterScale = interpolate(letterProgress, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const letterOpacity = interpolate(letterProgress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });
          const letterY = interpolate(letterProgress, [0, 1], [-150, 0], {
            extrapolateRight: "clamp",
          });
          const letterRotate = interpolate(letterProgress, [0, 1], [90, 0], {
            extrapolateRight: "clamp",
          });

          // グリッチスライス
          const sliceOffset = glitchSlice && i % 2 === 0 ? random(`slice-${i}-${frame}`) * 10 - 5 : 0;

          return (
            <span
              key={i}
              style={{
                fontFamily: "Arial Black, Impact, sans-serif",
                fontSize: 150,
                fontWeight: 900,
                color: "#fff",
                textShadow: `
                  0 0 ${25 * glowPulse}px rgba(201, 162, 39, 1),
                  0 0 ${50 * glowPulse}px rgba(201, 162, 39, 0.8),
                  0 0 ${75 * glowPulse}px rgba(201, 162, 39, 0.6),
                  0 0 ${100 * glowPulse}px rgba(201, 162, 39, 0.4),
                  4px 4px 0 #c9a227,
                  -2px -2px 0 #b87333
                `,
                letterSpacing: "0.05em",
                opacity: letterOpacity,
                transform: `translateY(${letterY + sliceOffset}px) scale(${letterScale}) rotate(${letterRotate}deg)`,
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* テキスト反射 */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          zIndex: 5,
          top: "58%",
          transform: `scaleY(-1) translateX(${glitchOffset}px)`,
          opacity: 0.15,
          filter: "blur(2px)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
        }}
      >
        {logoText.split("").map((letter, i) => {
          const letterProgress = spring({
            frame: frame - logoStart - i * letterDelay,
            fps,
            config: { damping: 10, stiffness: 180 },
          });
          const letterOpacity = interpolate(letterProgress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <span
              key={`ref-${i}`}
              style={{
                fontFamily: "Arial Black, Impact, sans-serif",
                fontSize: 150,
                fontWeight: 900,
                color: "#c9a227",
                opacity: letterOpacity,
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
          top: "68%",
          opacity: interpolate(subtitleProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0], { extrapolateRight: "clamp" })}px)`,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 32,
            color: "#c9a227",
            letterSpacing: "0.8em",
            margin: 0,
            textTransform: "uppercase",
            textShadow: `
              0 0 15px rgba(201, 162, 39, 1),
              0 0 30px rgba(201, 162, 39, 0.6)
            `,
          }}
        >
          Video Generation
        </p>
      </div>

      {/* スパークパーティクル */}
      {frame > flashTime &&
        Array.from({ length: 24 }).map((_, i) => {
          const particleDelay = i * 1.5;
          const particleProgress = spring({
            frame: frame - flashTime - particleDelay,
            fps,
            config: { damping: 8, stiffness: 60 },
          });

          const angle = (360 / 24) * i + random(`particle-${i}`) * 30;
          const distance = interpolate(particleProgress, [0, 1], [0, 400 + random(`dist-${i}`) * 150]);
          const particleOpacity = interpolate(particleProgress, [0, 0.15, 1], [0, 1, 0]);
          const particleSize = 3 + random(`size-${i}`) * 8;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: particleSize,
                height: particleSize,
                borderRadius: "50%",
                backgroundColor: i % 3 === 0 ? "#fff" : i % 3 === 1 ? "#c9a227" : "#ffdd44",
                boxShadow: `0 0 ${particleSize * 3}px ${i % 3 === 0 ? "#fff" : "#c9a227"}`,
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
              width: `${interpolate(frame - logoStart, [0, fps * 0.3], [0, 100], { extrapolateRight: "clamp" })}%`,
              height: "3px",
              background: "linear-gradient(90deg, transparent, #c9a227 20%, #c9a227 80%, transparent)",
              top: "38%",
              opacity: 0.8,
              boxShadow: "0 0 10px #c9a227",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: `${interpolate(frame - logoStart, [0, fps * 0.3], [0, 100], { extrapolateRight: "clamp" })}%`,
              height: "3px",
              background: "linear-gradient(90deg, transparent, #c9a227 20%, #c9a227 80%, transparent)",
              top: "62%",
              opacity: 0.8,
              boxShadow: "0 0 10px #c9a227",
            }}
          />
        </>
      )}

      {/* スキャンライン */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          top: scanlineY,
          pointerEvents: "none",
        }}
      />

      {/* ノイズオーバーレイ */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />

      {/* ビネット */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteIntensity}) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

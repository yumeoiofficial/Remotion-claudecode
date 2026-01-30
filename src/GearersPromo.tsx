import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GearersLogo } from "./GearersLogo";

export const GearersPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === タイミング定義 ===
  const logoEnd = 3 * fps;
  const catchphraseStart = 3 * fps;
  const catchphraseEnd = 5 * fps;
  const feature1Start = 5 * fps;
  const feature2Start = 7 * fps;
  const feature3Start = 9 * fps;
  const ctaStart = 11 * fps;
  const endStart = 13 * fps;

  // === カラー ===
  const primaryBlue = "#1a5a9c";
  const darkBg = "#0d1117";
  const grayText = "#8b949e";

  // === ロゴアニメーション (0-3秒) ===
  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(logoProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoFadeOut = interpolate(
    frame,
    [catchphraseStart, catchphraseStart + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === キャッチコピーアニメーション (3-5秒) ===
  const catchphraseOpacity = interpolate(
    frame,
    [catchphraseStart, catchphraseStart + 15, catchphraseEnd - 10, catchphraseEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === 特徴アニメーション ===
  const createFeatureAnimation = (startFrame: number) => {
    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 15, stiffness: 100 },
    });
    const opacity = interpolate(
      frame,
      [startFrame, startFrame + 10, startFrame + 50, startFrame + 60],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const x = interpolate(progress, [0, 1], [-100, 0], {
      extrapolateRight: "clamp",
    });
    return { opacity, x };
  };

  const feature1 = createFeatureAnimation(feature1Start);
  const feature2 = createFeatureAnimation(feature2Start);
  const feature3 = createFeatureAnimation(feature3Start);

  // === CTAアニメーション (11-13秒) ===
  const ctaProgress = spring({
    frame: frame - ctaStart,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(
    frame,
    [ctaStart, ctaStart + 10, endStart - 5, endStart],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // === エンドアニメーション (13-15秒) ===
  const endProgress = spring({
    frame: frame - endStart,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const endOpacity = interpolate(endProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // === 背景のグラデーション ===
  const bgGradientPos = interpolate(frame, [0, 15 * fps], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: darkBg,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* 動く背景グラデーション */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle at ${30 + bgGradientPos * 0.4}% ${40 + Math.sin(frame * 0.02) * 10}%,
            rgba(26, 90, 156, 0.15) 0%,
            transparent 50%)`,
          transform: "translate(-25%, -25%)",
        }}
      />

      {/* グリッド背景 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(26, 90, 156, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 90, 156, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* === シーン1: ロゴ登場 (0-3秒) === */}
      {frame < catchphraseStart + 15 && (
        <div
          style={{
            position: "absolute",
            opacity: logoOpacity * logoFadeOut,
            transform: `scale(${logoScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            filter: `drop-shadow(0 0 30px rgba(26, 90, 156, 0.5))`,
          }}
        >
          <GearersLogo size={450} showText={true} />
        </div>
      )}

      {/* === シーン2: キャッチコピー (3-5秒) === */}
      {frame >= catchphraseStart && frame < feature1Start + 10 && (
        <div
          style={{
            position: "absolute",
            opacity: catchphraseOpacity,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            下地は
            <span style={{ color: primaryBlue }}>AI</span>
            、仕上げは
            <span style={{ color: primaryBlue }}>人力</span>
            。
          </p>
        </div>
      )}

      {/* === シーン3-5: 特徴 (5-11秒) === */}
      {/* 特徴1 */}
      {frame >= feature1Start && frame < feature2Start + 30 && (
        <div
          style={{
            position: "absolute",
            opacity: feature1.opacity,
            transform: `translateX(${feature1.x}px)`,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: primaryBlue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 40,
            }}
          >
            ⚡
          </div>
          <div>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              大量生成で量産可能
            </p>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                color: grayText,
                margin: "10px 0 0 0",
              }}
            >
              AIが下地を高速生成
            </p>
          </div>
        </div>
      )}

      {/* 特徴2 */}
      {frame >= feature2Start && frame < feature3Start + 30 && (
        <div
          style={{
            position: "absolute",
            opacity: feature2.opacity,
            transform: `translateX(${feature2.x}px)`,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: primaryBlue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 40,
            }}
          >
            🔄
          </div>
          <div>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              即時初稿で修正依頼
            </p>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                color: grayText,
                margin: "10px 0 0 0",
              }}
            >
              すぐに確認、すぐにフィードバック
            </p>
          </div>
        </div>
      )}

      {/* 特徴3 */}
      {frame >= feature3Start && frame < ctaStart + 15 && (
        <div
          style={{
            position: "absolute",
            opacity: feature3.opacity,
            transform: `translateX(${feature3.x}px)`,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: primaryBlue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 40,
            }}
          >
            ✅
          </div>
          <div>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              人力編集で品質保証
            </p>
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 28,
                color: grayText,
                margin: "10px 0 0 0",
              }}
            >
              プロが最終仕上げを担当
            </p>
          </div>
        </div>
      )}

      {/* === シーン6: CTA (11-13秒) === */}
      {frame >= ctaStart && frame < endStart + 10 && (
        <div
          style={{
            position: "absolute",
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: primaryBlue,
              padding: "25px 80px",
              borderRadius: 60,
              boxShadow: `0 0 40px rgba(26, 90, 156, 0.6)`,
            }}
          >
            <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                color: "#ffffff",
                margin: 0,
              }}
            >
              今すぐ始めよう
            </p>
          </div>
        </div>
      )}

      {/* === シーン7: エンド (13-15秒) === */}
      {frame >= endStart && (
        <div
          style={{
            position: "absolute",
            opacity: endOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            filter: `drop-shadow(0 0 20px rgba(26, 90, 156, 0.4))`,
          }}
        >
          <GearersLogo size={350} showText={true} />
          <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 36,
              fontWeight: 500,
              color: grayText,
              margin: 0,
              letterSpacing: "0.1em",
            }}
          >
            gearers.com
          </p>
        </div>
      )}

      {/* 下部のアクセントライン */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          width: interpolate(frame, [0, 2 * fps], [0, 80], {
            extrapolateRight: "clamp",
          }) + "%",
          height: 4,
          background: `linear-gradient(90deg, transparent, ${primaryBlue}, transparent)`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

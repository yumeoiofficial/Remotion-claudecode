import { Composition } from "remotion";
import { AbcdefgAnimation } from "./AbcdefgAnimation";

export const RemotionRoot = () => {
  return (
    <Composition
      id="AbcdefgAnimation"
      component={AbcdefgAnimation}
      durationInFrames={6 * 30} // 6秒 × 30fps = 180フレーム
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

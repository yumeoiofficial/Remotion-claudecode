import { Composition } from "remotion";
import { AbcdefgAnimation } from "./AbcdefgAnimation";
import { GearersIntro } from "./GearersIntro";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AbcdefgAnimation"
        component={AbcdefgAnimation}
        durationInFrames={6 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GearersIntro"
        component={GearersIntro}
        durationInFrames={4 * 30} // 4秒
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

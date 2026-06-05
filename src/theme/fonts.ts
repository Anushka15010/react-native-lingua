import type { FontSource } from "expo-font";

import { fontFamily } from "./typography";

export const fonts: Record<(typeof fontFamily)[keyof typeof fontFamily], FontSource> = {
  [fontFamily.regular]: require("../../assets/assets/fonts/Poppins-Regular.ttf"),
  [fontFamily.medium]: require("../../assets/assets/fonts/Poppins-Medium.ttf"),
  [fontFamily.semiBold]: require("../../assets/assets/fonts/Poppins-SemiBold.ttf"),
  [fontFamily.bold]: require("../../assets/assets/fonts/Poppins-Bold.ttf"),
};

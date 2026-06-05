export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 31,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  h4: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 21,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 15,
  },
} as const;

export type AppTypography = typeof typography;

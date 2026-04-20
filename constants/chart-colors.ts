import type { ChartColor } from "@/features/widget/widget.types";

import { colorPalettes } from "@/styles/color-palettes";

type ColorShades = { [key: number]: string };
type ThemeColors = {
  default: ColorShades;
  primary: ColorShades;
  secondary: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  danger: ColorShades;
};
type Hue = keyof ThemeColors;

type ChartColorSet = { fill: string; text: string; stroke: string };
type ChartColorTheme = { light: ChartColorSet; dark: ChartColorSet };

const lightColors = colorPalettes.light as unknown as ThemeColors;
const darkColors = colorPalettes.dark as unknown as ThemeColors;

const HUES: Hue[] = ["default", "primary", "secondary", "success", "warning", "danger"];
const FILL_SHADES = [400, 500, 600] as const;
const TEXT_OFFSET_BY_HUE: Record<Hue, number> = {
  default: 300,
  primary: 200,
  secondary: 200,
  success: 300,
  warning: 300,
  danger: 200,
};

function buildColorSet(hue: Hue, fillShade: number): ChartColorTheme {
  const textShade = Math.min(900, fillShade + TEXT_OFFSET_BY_HUE[hue]);
  const light = {
    fill: lightColors[hue][fillShade],
    text: lightColors[hue][textShade],
    stroke: lightColors[hue][fillShade],
  };
  const dark = {
    fill: darkColors[hue][fillShade],
    text: darkColors[hue][textShade],
    stroke: darkColors[hue][fillShade],
  };
  return { light, dark };
}

export const CHART_COLORS = HUES.reduce(
  (acc, hue) => {
    FILL_SHADES.forEach((shade, i) => {
      const key = `${hue}${i + 1}` as ChartColor;
      acc[key] = buildColorSet(hue, shade);
    });
    return acc;
  },
  {} as Record<ChartColor, ChartColorTheme>,
);

function pick(theme: string | undefined, field: keyof ChartColorSet): Record<ChartColor, string> {
  const selected = theme === "dark" ? "dark" : "light";
  return Object.entries(CHART_COLORS).reduce(
    (acc, [key, value]) => {
      acc[key as ChartColor] = value[selected][field];
      return acc;
    },
    {} as Record<ChartColor, string>,
  );
}

export function getChartColors(theme: string | undefined) {
  return pick(theme, "fill");
}

export function getChartTextColors(theme: string | undefined) {
  return pick(theme, "text");
}

export function getChartStrokeColors(theme: string | undefined) {
  return pick(theme, "stroke");
}

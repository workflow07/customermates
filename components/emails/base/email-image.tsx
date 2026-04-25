import type { CSSProperties } from "react";

import { Img } from "@react-email/components";

type Props = {
  alt?: string;
  className?: string;
  height?: number | string;
  src: string;
  style?: CSSProperties;
  width?: number | string;
};

export function EmailImage({ alt, className, height, src, style, width }: Props) {
  return <Img alt={alt} className={className} height={height} src={src} style={style} width={width} />;
}

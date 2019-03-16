export interface IRyzomMessage {
  color: string;
  text: string;
}

export interface IRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function ryzomCodeParser(
  rawMessage: string,
): Array<IRyzomMessage> | null {
  if (!rawMessage) {
    return null;
  }

  const colorPattern: RegExp = /@{[0-9a-fA-F]{4}}/gm;
  const texts: string[] = rawMessage.split(colorPattern);
  if (texts[0] === '') {
    texts.splice(0, 1);
  }

  const colors: string[] = [];
  let m: RegExpExecArray;
  while ((m = colorPattern.exec(rawMessage)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === colorPattern.lastIndex) {
      colorPattern.lastIndex++;
    }
    m.forEach((match: string) => {
      colors.push(match);
    });
  }

  const messages: Array<IRyzomMessage> = [];
  const shift = texts.length - colors.length;
  texts.forEach((value: string, index: number) => {
    messages.push({
      color: index - shift >= 0 ? colors[index - shift] : '',
      text: value,
    });
  });

  return messages;
}

export function ryzomColorCodeToRGBA(ryzomColorCode: string): IRGBA | null {
  if (!ryzomColorCode) {
    return null;
  }

  if (!ryzomColorCode.match(/@{[0-9a-fA-F]{4}}/)) {
    return null;
  }

  const ryzomColorPattern = /@{(?<r>[0-9a-fA-F]){1,}(?<g>[0-9a-fA-F]){1,}(?<b>[0-9a-fA-F]){1,}(?<a>[0-9a-fA-F]){1,}}/;
  const colors = ryzomColorPattern.exec(ryzomColorCode);

  // Convert 12-bit to 24-bit
  const color12BitTo24Bit = (color12: string): number => {
    const c12 = parseInt(color12, 16);
    return Math.round((c12 * 255) / 15);
  };
  const r = color12BitTo24Bit(colors['groups'].r);
  const g = color12BitTo24Bit(colors['groups'].g);
  const b = color12BitTo24Bit(colors['groups'].b);

  // Convert transparent bit
  const alpha12BitTo24Bit = (alpha12: string): number => {
    const a12 = parseInt(alpha12, 16);
    return a12 / 15;
  };
  const a = alpha12BitTo24Bit(colors['groups'].a);

  return { r, g, b, a };
}

export function RGBAToRyzomColorCode(rgba: IRGBA): string {
  // Convert 24-bit to 12-bit for first 3 charactors
  const RGB24BitTo12Bit = (color24: number): string => {
    const c24 = Math.round((color24 * 15) / 255);
    return c24.toString(16);
  };
  const r = RGB24BitTo12Bit(rgba.r);
  const g = RGB24BitTo12Bit(rgba.g);
  const b = RGB24BitTo12Bit(rgba.b);

  // Convert transparent bit (last charactor)
  const alpha24BitTo12Bit = (alpha24: number): string => {
    const a24 = Math.round(alpha24 * 15);
    return a24.toString(16);
  };
  const a = alpha24BitTo12Bit(rgba.a);

  return `@{${r}${g}${b}${a}}`;
}

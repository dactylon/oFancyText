import {
  ryzomCodeParser,
  ryzomColorCodeToRGBA,
  RGBAToRyzomColorCode,
} from './ryzom-code';

test('parse empty message', () => {
  expect(ryzomCodeParser('')).toEqual(null);
});

test('parse raw message with only colors', () => {
  expect(
    ryzomCodeParser('@{10ff}@{20ff}@{30ff}@{40ff}@{50ff}@{60ff}\n'),
  ).toEqual([
    { color: '@{10ff}', text: '' },
    { color: '@{20ff}', text: '' },
    { color: '@{30ff}', text: '' },
    { color: '@{40ff}', text: '' },
    { color: '@{50ff}', text: '' },
    { color: '@{60ff}', text: '\n' },
  ]);
});

test('parse raw message with only text', () => {
  expect(
    ryzomCodeParser('0abc1defghkdjfdl2sdfd\nabc3defghkdjfdl4ssdfdf\n'),
  ).toEqual([
    { color: '', text: '0abc1defghkdjfdl2sdfd\nabc3defghkdjfdl4ssdfdf\n' },
  ]);
});

test('parse raw message without color at start', () => {
  expect(
    ryzomCodeParser(
      '0abc@{10ff}1defghkdjfdl@{20ff}2sdfd\nabc@{30ff}3defghkdjfdl@{40ff}4ssdfdf@{50ff}@{60ff}\n',
    ),
  ).toEqual([
    { color: '', text: '0abc' },
    { color: '@{10ff}', text: '1defghkdjfdl' },
    { color: '@{20ff}', text: '2sdfd\nabc' },
    { color: '@{30ff}', text: '3defghkdjfdl' },
    { color: '@{40ff}', text: '4ssdfdf' },
    { color: '@{50ff}', text: '' },
    { color: '@{60ff}', text: '\n' },
  ]);
});

test('parse raw message with color at start', () => {
  expect(
    ryzomCodeParser(
      '@{10ff}1defghkdjfdl@{20ff}2sdfd\nabc@{30ff}3defghkdjfdl@{40ff}4ssdfdf@{50ff}@{60ff}\n',
    ),
  ).toEqual([
    { color: '@{10ff}', text: '1defghkdjfdl' },
    { color: '@{20ff}', text: '2sdfd\nabc' },
    { color: '@{30ff}', text: '3defghkdjfdl' },
    { color: '@{40ff}', text: '4ssdfdf' },
    { color: '@{50ff}', text: '' },
    { color: '@{60ff}', text: '\n' },
  ]);
});

test('ryzom color to RGBA: empty string', () => {
  expect(ryzomColorCodeToRGBA('')).toEqual(null);
});

test('ryzom color to RGBA: wrong code', () => {
  expect(ryzomColorCodeToRGBA('ffff')).toEqual(null);
});

test('ryzom color to RGBA: red', () => {
  expect(ryzomColorCodeToRGBA('@{f00f}')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
});

test('ryzom color to RGBA: green', () => {
  expect(ryzomColorCodeToRGBA('@{0f0f}')).toEqual({ r: 0, g: 255, b: 0, a: 1 });
});

test('ryzom color to RGBA: blue', () => {
  expect(ryzomColorCodeToRGBA('@{00ff}')).toEqual({ r: 0, g: 0, b: 255, a: 1 });
});

test('ryzom color to RGBA: black', () => {
  expect(ryzomColorCodeToRGBA('@{000f}')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
});

test('ryzom color to RGBA: white', () => {
  expect(ryzomColorCodeToRGBA('@{ffff}')).toEqual({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });
});

test('ryzom color to RGBA: transparent white', () => {
  expect(ryzomColorCodeToRGBA('@{fff0}')).toEqual({
    r: 255,
    g: 255,
    b: 255,
    a: 0,
  });
});

test('RGBA to ryzom color: red', () => {
  expect(RGBAToRyzomColorCode({ r: 255, g: 0, b: 0, a: 1 })).toEqual('@{f00f}');
});

test('RGBA to ryzom color: green', () => {
  expect(RGBAToRyzomColorCode({ r: 0, g: 255, b: 0, a: 1 })).toEqual('@{0f0f}');
});

test('RGBA to ryzom color: blue', () => {
  expect(RGBAToRyzomColorCode({ r: 0, g: 0, b: 255, a: 1 })).toEqual('@{00ff}');
});

test('RGBA to ryzom color: black', () => {
  expect(RGBAToRyzomColorCode({ r: 0, g: 0, b: 0, a: 1 })).toEqual('@{000f}');
});

test('RGBA to ryzom color: white', () => {
  expect(RGBAToRyzomColorCode({ r: 255, g: 255, b: 255, a: 1 })).toEqual(
    '@{ffff}',
  );
});

test('RGBA to ryzom color: transparent white', () => {
  expect(RGBAToRyzomColorCode({ r: 255, g: 255, b: 255, a: 0 })).toEqual(
    '@{fff0}',
  );
});

import { Color } from './types';

export const toRadius = (degree: number) => (degree * Math.PI) / 180;

const randomColor = (): Color => ({
  r: Math.floor(Math.random() * 255),
  g: Math.floor(Math.random() * 255),
  b: Math.floor(Math.random() * 255),
});

export const randomColors = (count: number) : Color[] => {
  const colors: Color[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(randomColor());
  }
  return colors;
};

export const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/*
    An easing function that makes the motion start fast and then slow down gradually as it approaches the end.
    x is typically a value between 0 and 1
    0 (no movement initially)
    1 (full movement at the end).
*/
export const easeOutSine = (x: number) => Math.sin((x * Math.PI) / 2);

export const getPercent = (value: number, max: number, min: number) =>
  (value - min) / (max - min);

/*
  result is within the desired range (1080 to 2160).
*/
export const randomRotation = () =>  Math.random() * (360 * 6 - 360 * 3) + 360 * 3;
import { Color } from "./types";

export const toRad = (deg:number) => (deg * Math.PI) / 180;

export const randomColor = () : Color => ({
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255)
})

export const randomRange = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const easeOutSine = (x:number) => Math.sin((x * Math.PI) / 2);

export const getPercent = (value:number, max:number, min:number) => (value - min) / (max - min);
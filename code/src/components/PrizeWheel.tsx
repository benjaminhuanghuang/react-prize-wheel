import { useRef, useState, useEffect, useCallback } from 'react';

import { Color } from '../types';
import { emails } from '../emails';
import {
  randomColors,
  toRadius,
  easeOutSine,
  getPercent,
  randomRotation,
} from '../utils';
import Popup from './Popup';
// Assets
import pointer from '../assets/pointer.svg';

const RADIUS = 400; // Wheel radius

const PrizeWheel = () => {
  console.log('PrizeWheel is re-render');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef<Color[]>([]);
  const maxRotationRef = useRef(randomRotation());
  const currentDegreeRef = useRef(0);

  const [winner, setWinner] = useState('');
  const [speed, setSpeed] = useState<number>(0);
  const itemDegs = useRef<{
    [key: string]: { startDeg: number; endDeg: number };
  }>({});

  const [isSpinning, setIsSpinning] = useState(false);

  // Popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const draw = useCallback(() => {
    console.log('draw');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const step = 360 / emails.length;
    let startDeg = currentDegreeRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, RADIUS, toRadius(0), toRadius(360));
    ctx.fillStyle = `rgb(33, 33, 33)`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw the wheel segments
    for (let i = 0; i < emails.length; i++, startDeg += step) {
      const endDeg = startDeg + step;
      const color = colorsRef.current[i];
      const colorStyle = `rgb(${color.r},${color.g},${color.b})`;
      // slightly darker
      const colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        RADIUS - 2,
        toRadius(startDeg),
        toRadius(endDeg),
      );
      ctx.fillStyle = colorStyle2;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        RADIUS - 30,
        toRadius(startDeg),
        toRadius(endDeg),
      );
      ctx.fillStyle = colorStyle;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(toRadius((startDeg + endDeg) / 2));
      ctx.textAlign = 'center';
      ctx.fillStyle =
        color.r > 150 || color.g > 150 || color.b > 150 ? '#000' : '#fff';
      ctx.font = 'bold 20px serif';
      ctx.fillText(emails[i].fullName, 240, 10, 200);
      ctx.restore();

      // Record the start degree and end degree of each item
      itemDegs.current[emails[i].email] = {
        startDeg,
        endDeg,
      };

      /* 
      Check winner
        startDeg lies in the bottom-right quadrant (270°–360°).
        endDeg lies in the top-right quadrant (0°–90°).
      */
      if (
        startDeg % 360 < 360 &&
        startDeg % 360 > 270 &&
        endDeg % 360 > 0 &&
        endDeg % 360 < 90
      ) {
        setWinner(emails[i].fullName);
        openPopup();
        setIsSpinning(false);
      }
    }
  }, []);

  const animate = () => {
    // if (!isSpinning) return;
    console.log("--------animate");
    setSpeed(
      easeOutSine(
        getPercent(currentDegreeRef.current, maxRotationRef.current, 0),
      ) * 20,
    );

    if (speed < 0.01) {
      setSpeed(0);
      setIsSpinning(false);
    }
    currentDegreeRef.current = currentDegreeRef.current + speed;
    draw();
    window.requestAnimationFrame(animate);
  };

  const spin = () => {
    setIsSpinning(true);
    currentDegreeRef.current = 0;

    draw();
    maxRotationRef.current = randomRotation();
    window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    colorsRef.current = randomColors(emails.length);
    draw();
  }, [draw]); // runs once after the component mounts

  return (
    <div className='bg-slate-950 flex-1 grid place-items-center relative'>
      <Popup
        title='The Winner is:'
        message={winner}
        isOpen={isPopupOpen}
        closePopup={closePopup}
      />
      <canvas
        ref={canvasRef}
        width='800'
        height='800'
      />
      <div
        className={`w-[100px] h-[100px] rounded-full bg-white absolute m-auto
          ${isSpinning ? 'bg-slate-500 cursor-not-allowed pointer-events-none' : 'hover:bg-red-500 cursor-pointer'}`}
        onClick={() => spin()}
      ></div>
      <img
        src={pointer}
        alt='pointer'
        className='absolute mt-auto right-[410px]'
      />
    </div>
  );
};

export default PrizeWheel;

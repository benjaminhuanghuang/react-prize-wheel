import { useRef, useState, useEffect, useCallback } from 'react';
import useAudio from '../hooks/useAudio';
import { Color } from '../types';
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
import cheering from '../assets/cheering.mp3';
import spinmp3 from '../assets/spin.mp3';
// Context
import { useAppContext } from '../appContext';

const RADIUS = 400; // Wheel radius

const PrizeWheel = () => {
  console.log('PrizeWheel is re-render');
  const { filteredMailList, isLoading, error, setIsSpinning } = useAppContext();

  const [playSheeringAudio, stopSheeringAudio] = useAudio(cheering);
  const [playSpinAudio, stopSpinAudio] = useAudio(spinmp3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef<Color[]>([]);
  const maxRotationRef = useRef(randomRotation());
  const currentDegreeRef = useRef(0);
  const speedRef = useRef(0);
  const itemDegreesRef = useRef<{
    [key: string]: { startDegree: number; endDegree: number };
  }>({});
  const isSpinningRef = useRef(false);

  const [winner, setWinner] = useState('');

  // Popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    playSheeringAudio();
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    stopSheeringAudio();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, RADIUS, toRadius(0), toRadius(360));
    ctx.fillStyle = `rgb(33, 33, 33)`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw the wheel segments
    for (let i = 0; i < filteredMailList.length; i++) {
      const startDegree =
        itemDegreesRef.current[filteredMailList[i].emailAddress].startDegree;
      const endDegree =
        itemDegreesRef.current[filteredMailList[i].emailAddress].endDegree;
      const color = colorsRef.current[i];
      const colorStyle = `rgb(${color.r},${color.g},${color.b})`;
      // slightly darker
      const colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        RADIUS - 2,
        toRadius(startDegree),
        toRadius(endDegree),
      );
      ctx.fillStyle = colorStyle2;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        RADIUS - 30,
        toRadius(startDegree),
        toRadius(endDegree),
      );
      ctx.fillStyle = colorStyle;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(toRadius((startDegree + endDegree) / 2));
      ctx.textAlign = 'center';
      ctx.fillStyle =
        color.r > 150 || color.g > 150 || color.b > 150 ? '#000' : '#fff';
      ctx.font = 'bold 20px serif';
      ctx.fillText(filteredMailList[i].fullName, 240, 10, 200);
      ctx.restore();
    }
  }, [filteredMailList]);

  const update = useCallback(() => {
    const step = 360 / filteredMailList.length;
    let startDegree = currentDegreeRef.current;
    for (let i = 0; i < filteredMailList.length; i++) {
      const endDegree = startDegree + step;
      // Record the start degree and end degree of each item
      itemDegreesRef.current[filteredMailList[i].emailAddress] = {
        startDegree,
        endDegree,
      };
      startDegree = endDegree;
    }
  }, [filteredMailList]);

  const checkResult = () => {
    speedRef.current =
      easeOutSine(
        getPercent(currentDegreeRef.current, maxRotationRef.current, 0),
      ) * 20;
    currentDegreeRef.current = currentDegreeRef.current + speedRef.current;

    if (speedRef.current < 0.01) {
      speedRef.current = 0;
      isSpinningRef.current = false;
      setIsSpinning(false);
      stopSpinAudio();
      /* 
      Check winner
        startDeg lies in the bottom-right quadrant (270°–360°).
        endDeg lies in the top-right quadrant (0°–90°).
      */
      for (let i = 0; i < filteredMailList.length; i++) {
        const { startDegree, endDegree } =
          itemDegreesRef.current[filteredMailList[i].emailAddress];
        if (
          startDegree % 360 < 360 &&
          startDegree % 360 > 270 &&
          endDegree % 360 > 0 &&
          endDegree % 360 < 90
        ) {
          setWinner(filteredMailList[i].fullName);
          openPopup();
        }
      }
    }
  };
  const animate = () => {
    if (!isSpinningRef.current) return;
    update();
    draw();
    checkResult();

    draw();
    window.requestAnimationFrame(animate);
  };

  const spin = () => {
    setIsSpinning(true);
    playSpinAudio();
    isSpinningRef.current = true;
    currentDegreeRef.current = 0;
    maxRotationRef.current = randomRotation();
    window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    colorsRef.current = randomColors(filteredMailList.length);
    speedRef.current = 0;
    isSpinningRef.current = false;
    update();
    draw();
  }, [update, draw, filteredMailList, isLoading]); // runs once after the component mounts

  return (
    <div className='bg-slate-950 h-full w-full grid place-items-center relative min-w-[800px] min-h-[800px]'>
      <Popup
        title='The Winner is:'
        message={winner}
        isOpen={isPopupOpen}
        closePopup={closePopup}
      />
      {error && (
        <div className='absolute p-5 rounded-lg m-auto translate-y-[-100px] text-red-500 font-bold text-4xl bg-black/80'>
          {error}
        </div>
      )}
      {isLoading ? (
        <div className='text-white'>Loading...</div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width='800'
            height='800'
            // className='bg-red-100'
          />
          <button
            className={`w-[100px] h-[100px] px-6 py-3 bg-blue-800 hover:bg-blue-700 rounded-full absolute m-auto  
          shadow-md hover:shadow-lg cursor-pointer 
          disabled:bg-gray-700 disabled:hover:bg-gray-700 disabled:cursor-not-allowed`}
            disabled={isSpinningRef.current || error != null}
            onClick={() => spin()}
          ></button>
          <img
            src={pointer}
            alt='pointer'
            className='absolute m-auto translate-x-[380px]'
          />
        </>
      )}
    </div>
  );
};

export default PrizeWheel;

/*
text-white font-semibold 
*/

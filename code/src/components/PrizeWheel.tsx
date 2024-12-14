import { useRef, useState, useEffect } from 'react';

import { emails } from '../emails';
import { Color } from '../types';
import { randomColor } from '../utils';
import Popup from './Popup';

// const radius = 150; // Wheel radius

const PrizeWheel = () => {
  const canvasRef = useRef(null);
  const colors = useRef<Color[]>([]); // Colors for segments
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  //   const [currentDeg, setCurrentDeg] = useState(0);
  //   const [speed, setSpeed] = useState(0);
  //   const [pause, setPause] = useState(true);

  //   const maxRotation = useRef(0);
  //   const itemDegs = useRef({}); // Store segment start/end degrees

  // Initialize colors for segments
  useEffect(() => {
    colors.current = Array(emails.length)
      .fill(null)
      .map(() => randomColor());

    // Test
    setWinner(emails[0].fullName);
  }, []);

  const spin = () => {
    console.log('Start Spin');
    setIsSpinning(true);
    openPopup();
  };
  return (
    <div className=' bg-slate-950 flex-1 grid place-items-center relative'>
      <Popup
        title='The Winner is:'
        message={winner}
        isOpen={isPopupOpen}
        closePopup={closePopup}
      />
      <canvas
        ref={canvasRef}
        className='w-[800px] h-[800px] bg-red-300'
      />
      <div
        className={`w-[100px] h-[100px] rounded-full bg-white absolute m-auto
          ${isSpinning ? 'bg-slate-500 cursor-not-allowed pointer-events-none' : 'hover:bg-red-500 cursor-pointer'}`}
        onClick={() => spin()}
      ></div>
      {/* The pointer */}
      <div
        className='w-0 h-0 border-t-[10px] border-b-[10px] border-r-[30px] border-t-transparent border-b-transparent 
        border-r-white absolute mt-auto right-[400px]'
      ></div>
    </div>
  );
};

export default PrizeWheel;

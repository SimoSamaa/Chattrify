import React, { useState, useRef, useEffect } from 'react';
import SidebarHeader from '@/components/layouts/SidebarHeader';
import Chats from '@/components/chat/Chats';
import logo from '@/assets/logo.png';
import { Toaster } from '@/components/ui/toaster';

const Home = () => {
  const [isResize, setIsResize] = useState(false);
  const leftSide = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(localStorage['resize']);

  useEffect(() => {
    if (leftSide.current) {
      leftSide.current.style.width = `${width}vw`;
    }
  }, [width]);

  const resize = (e: MouseEvent) => {
    const newWidthPx = e.clientX - leftSide.current!.offsetLeft;
    let newWidthPercent = (newWidthPx / window.innerWidth) * 100;
    if (newWidthPercent < 20) newWidthPercent = 20;
    if (newWidthPercent > 50) newWidthPercent = 50;

    leftSide.current!.style.width = `${newWidthPercent}vw`;

    setWidth(newWidthPercent);
    localStorage['resize'] = String(newWidthPercent);
  };

  const handelResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResize(true);

    document.body.style.cursor = 'ew-resize';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', () => {
      setIsResize(false);
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', resize);
    });
  };

  return (
    <div className='pl-[50px]'>
      <SidebarHeader />
      <main className='flex h-screen w-full'>
        <div ref={leftSide} className='overflow-hidden relative w-[30vw] min-w-[300px] min-w-1/2'>
          <span
            id='resize'
            onMouseDown={handelResize}
            className={`w-[5px] h-full absolute top-0 right-0 z-10 select-none cursor-e-resize border-r ${isResize ? 'bg-primary' : 'bg-transparent hover:bg-primary'}`}></span>
          <Chats />
        </div>
        <div className='flex-1'>
          <div className='gird place-content-center w-full h-full text-center space-y-4 bg-card'>
            <img src={logo} alt="logo" className='w-[200px] mx-auto' />
            <h1 className='text-4xl font-semibold'>Welcome to Chattrify</h1>
            <p className='text-lg'>Select a chat to start messaging</p>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Home;

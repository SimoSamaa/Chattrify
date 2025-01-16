import React, { useState, useRef, useEffect } from 'react';
import SidebarHeader from '@/components/layouts/SidebarHeader';

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
        <div ref={leftSide} className='overflow-hidden relative w-[30vw] p-4 min-w-[250px] min-w-1/2'>
          <span
            id='resize'
            onMouseDown={handelResize}
            className={`w-[5px] h-full absolute top-0 right-0 select-none cursor-e-resize border-r ${isResize ? 'bg-muted' : 'bg-transparent hover:bg-muted'}`}></span>
        </div>
        <div className='flex-1'>messages</div>
      </main>
    </div>
  );
};

export default Home;

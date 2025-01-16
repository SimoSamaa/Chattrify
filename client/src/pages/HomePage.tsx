import React, { useState, useRef } from 'react';
import SidebarHeader from '@/components/layouts/SidebarHeader';

const Home = () => {
  const [isResize, setIsResize] = useState(false);
  const leftSide = useRef<HTMLDivElement | null>(null);

  const resize = (e: MouseEvent) => {
    let newWidth = e.clientX - leftSide.current!.offsetLeft;
    if (newWidth < 250) newWidth = 250;
    if (newWidth > window.innerWidth * 0.5) newWidth = window.innerWidth * 0.5;
    leftSide.current!.style.width = `${newWidth}px`;

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

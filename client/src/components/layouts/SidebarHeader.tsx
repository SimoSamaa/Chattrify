import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import styled from 'styled-components';
import tw from 'twin.macro';
import { AlignJustify, MessageSquareText, CircleDashed, Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const SidebarHeader = () => {
  const { picture } = useSelector((state: RootState) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const header = useRef<HTMLElement | null>(null);

  const handleClickOutside = (e: Event) => {
    const target = e.target as HTMLElement;
    const id = '#' + header.current?.id;
    const toggleEle = target.matches(id);
    const menuElement = target.closest(id);
    const matchesEle = !!menuElement;
    if (!(toggleEle === false && matchesEle === false)) return;
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <TooltipProvider >
      <StyledHeader
        id='sidebar'
        ref={header}
        $open={isSidebarOpen}
        className={`h-screen ${!isSidebarOpen ? 'w-[50px]' : 'w-[240px]'} bg-card py-4 px-2 flex flex-col justify-between [&_svg]:size-5 transition-all duration-150 ease-out fixed top-0 left-0 border-r z-50`}>
        <ul className='grid gap-4'>
          <li>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='!w-auto'>
              <AlignJustify />
            </button>
          </li>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='active'>
                  <MessageSquareText />
                  <p>Chat</p>
                </button>
              </TooltipTrigger>
              {!isSidebarOpen && (<TooltipContent side='right'>Chat</TooltipContent>)}
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <CircleDashed />
                  <p>Status</p>
                </button>
              </TooltipTrigger>
              {!isSidebarOpen && (<TooltipContent side='right'>Status</TooltipContent>)}
            </Tooltip>
          </li>
        </ul>
        <ul className='grid gap-4'>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <Settings />
                  <p>Settings</p>
                </button>
              </TooltipTrigger>
              {!isSidebarOpen && (<TooltipContent side='right'>Settings</TooltipContent>)}
            </Tooltip>
          </li>
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <img src={picture} alt="user-picture" className='size-5 rounded-full' />
                  <p>Profile</p>
                </button>
              </TooltipTrigger>
              {!isSidebarOpen && (<TooltipContent side='right'>Profile</TooltipContent>)}
            </Tooltip>
          </li>
        </ul>
      </StyledHeader >
    </TooltipProvider>
  );
};

interface StyledHeaderProps {
  $open: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
  button {
    ${tw`h-9 rounded flex items-center gap-2 w-full px-2 transition-colors duration-150 ease-out relative`}

    &:is(:hover, :focus-visible)  {
      ${tw`bg-primary/10`}
    }

    &:active {
      ${tw`text-muted-foreground`};
    }

    &.active {
      ${tw`bg-primary/10`};

      &::before {
      ${tw`content-[''] absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-[3px] bg-primary rounded-full`};
    }
    }

    p {
      ${({ $open }) => (!$open ? tw`hidden` : tw`block`)}
  }
  }
`;

export default SidebarHeader;
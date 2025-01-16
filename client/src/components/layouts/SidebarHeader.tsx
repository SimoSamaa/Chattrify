import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import styled from 'styled-components';
import tw from 'twin.macro';
import { AlignJustify, MessageSquareText, CircleDashed, Settings } from 'lucide-react';

const SidebarHeader = () => {
  const { picture } = useSelector((state: RootState) => state.auth.user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <StyledHeader $open={isSidebarOpen} className={`h-screen ${!isSidebarOpen ? 'w-[50px]' : 'w-[240px]'} bg-card py-4 px-2 flex flex-col justify-between [&_svg]:size-5 transition-all duration-150 ease-out fixed top-0 left-0 border-r`}>
      <ul className='grid gap-4'>
        <li>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='!w-auto'>
            <AlignJustify />
          </button>
        </li>
        <li>
          <button className='active'>
            <MessageSquareText />
            <p>Chat</p>
          </button>
        </li>
        <li>
          <button>
            <CircleDashed />
            <p>Status</p>
          </button>
        </li>
      </ul>
      <ul className='grid gap-4'>
        <li>
          <button>
            <Settings />
            <p>Settings</p>
          </button>
        </li>
        <li>
          <button>
            <img src={picture} alt="user-picture" className='size-5 rounded-full' />
            <p>Profile</p>
          </button>
        </li>
      </ul>
    </StyledHeader >
  );
};

interface StyledHeaderProps {
  $open: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
  button {
    ${tw`h-9 rounded flex items-center gap-2 w-full px-2 transition-colors duration-150 ease-out relative`}

    &:hover  {
      ${tw`bg-muted`}
    }

    &:active  {
      ${tw`text-muted-foreground`};
    }

    &.active {
      ${tw`bg-muted`};

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
import { styled } from 'styled-components';
import tw from 'twin.macro';

const GlobalLoading = () => {
  return (
    <div className="z-[1000] h-screen bg-background grid place-content-center">
      <Loading>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={`bar-${i + 1}`}></span>
        ))}
      </Loading>
    </div>
  );
};

const Loading = styled.div`
  ${tw`relative w-[164px] h-[100px]`};
  
  span {
    ${tw`absolute w-[10px] h-[30px] bg-primary rounded-[5px]`};
    animation: loader_51899 1.5s ease-in-out infinite;
  }

  ${Array.from({ length: 9 })
    .map(
      (_, index) => `
      .bar-${index + 1} {
        left: ${index * 20}px;
        animation-delay: ${index * 0.15}s;
      }
    `
    )
    .join("")}

  @keyframes loader_51899 {
    50% {
      height: 70px;
      transform: translate(0, 35px);
    }
  }
`;

export default GlobalLoading;
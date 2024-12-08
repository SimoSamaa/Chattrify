import { styled } from 'styled-components';
import tw from 'twin.macro';

const BackgroundAnimation = () => {

  return (
    <Area >
      <ul>
        {Array.from({ length: 150 }, (_, i) => <li key={i}></li>)}
      </ul>
    </Area>
  );
};

const Area = styled.div`
  ${tw`inset-0 -z-10 fixed`}

  li{
    ${tw`absolute w-5 h-5 -bottom-[150px] bg-primary rounded-[4px]`};
    animation: animate 25s linear infinite reverse;
    will-change: transform, opacity;
  }

  ${Array.from({ length: 150 }, (_, i) =>
  `li:nth-child(${i + 1}) {
      --size: ${i * 0.15}px;
      left: ${Math.random() * 100}%;
      opacity: 0;
      width: var(--size);
      height: var(--size);
      animation-duration: ${(Math.random() * 10 + 15).toFixed(1)}s;
  }`
)}

@keyframes animate {
  40% {
    border-radius: 50%;
  }
  
  100% {
    transform: translateY(-900px) rotate(720deg);
    opacity: 1;
    border-radius: 5px;
  }
}`;

export { BackgroundAnimation };
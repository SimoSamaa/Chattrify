import { memo, FC } from "react";
import { usePasswordStrength } from '@/hooks/custom-hooks';
import tw from 'twin.macro';
import styled from 'styled-components';

const PasswordStrength: FC<{ password: string; }> = memo(({ password }) => {
  const passwordStrength = usePasswordStrength(password);

  return (
    <PasswordStrongValidation $strength={passwordStrength}>
      {Array.from({ length: 3 }, (_, ind) => <span key={ind} />)}
    </PasswordStrongValidation>
  );
});

interface PasswordStrongValidationProps {
  $strength: string[];
}

const PasswordStrongValidation = styled.div<PasswordStrongValidationProps>`
  & {
    ${tw`flex gap-2 w-fit ml-auto`}

    span {
      ${tw`border h-2 w-10 rounded-full bg-muted overflow-hidden relative`}

      &:before {
        ${tw`content-[''] absolute top-0 left-0 h-full transition-all duration-500`}
      }

  ${({ $strength }) => {
    const strengths = ['weak', 'medium', 'strong'];
    const colors = ['#dc2626', '#ca8a04', '#16a34a'];
    return strengths.map((strength, index) =>
      `&:nth-child(${index + 1})::before {
        background-color: ${$strength.includes(strength) ? colors[index] : 'transparent'};
        width: ${$strength.includes(strength) ? '100%' : '0'};
      }`).join(' ');
  }}
    }
  }`;

export { PasswordStrength };
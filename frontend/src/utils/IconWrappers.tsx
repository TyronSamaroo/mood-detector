import React from 'react';
import { FaSun, FaMoon, FaArrowLeft, FaGithub, FaPaperPlane, FaSpinner } from 'react-icons/fa';

// Icon wrapper HOC to fix type issues
function createIconComponent(IconComponent: any) {
  const IconWrapper = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    (props, ref) => {
      return (
        <span className="inline-flex" ref={ref} {...props}>
          <IconComponent />
        </span>
      );
    }
  );
  
  IconWrapper.displayName = `Wrapped${IconComponent.name || 'Icon'}`;
  return IconWrapper;
}

// Create wrapped icon components
export const SunIcon = createIconComponent(FaSun);
export const MoonIcon = createIconComponent(FaMoon);
export const ArrowLeftIcon = createIconComponent(FaArrowLeft);
export const GithubIcon = createIconComponent(FaGithub);
export const PaperPlaneIcon = createIconComponent(FaPaperPlane);
export const SpinnerIcon = createIconComponent(FaSpinner); 
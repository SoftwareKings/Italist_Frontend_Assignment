import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/image', () => {

  // Properly typed component so no "any" and has a displayName
  const MockNextImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
    return React.createElement('img', {
      ...props,
      alt: props.alt ?? '',
    });
  };
  MockNextImage.displayName = 'MockNextImage';

  return { __esModule: true, default: MockNextImage };
});
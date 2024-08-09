import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { classNames } from 'tinacms';

interface LoadedImageProps extends ImageProps {
  alt: string;
  src: string;
  className?: string;
}

export default function LoadedImage({ alt, src, className = '', ...props }: LoadedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <Image
      alt={alt}
      src={src}
      className={classNames(
        'loaded-image transition-opacity duration-200 ease-out',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onLoad={handlLoaded}
      {...props}
    />
  );
}

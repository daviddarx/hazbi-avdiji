import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import { mediaLinksURLPrefix } from '@/utils/core';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);
  const textContainer = useRef<HTMLDivElement | null>(null);

  const handleMediaClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      const mediaURL = e.target.href.split(mediaLinksURLPrefix);
      if (mediaURL.length > 1) {
        setCurrentMediaId(mediaURL[1]);
      }
    }

    e.preventDefault();
  };

  const closeMedia = () => {
    setCurrentMediaId(null);
  };

  useEffect(() => {
    console.log(currentMediaId);
  }, [currentMediaId]);

  useEffect(() => {
    const textContainerEl = textContainer.current;

    textContainerEl!.addEventListener('click', handleMediaClick);

    return () => {
      textContainerEl!.removeEventListener('click', handleMediaClick);
    };
  }, []);

  return (
    <section className='layout-grid'>
      <div className='text-container relative col-start-4 col-end-10'>
        {props.content && (
          <div ref={textContainer} data-tina-field={tinaField(props, 'content')}>
            <CustomMarkdown content={props.content} />
          </div>
        )}
        {props.mediaBlocks && (
          <div className='absolute left-0 top-0 z-70 bg-white'>
            {props.mediaBlocks.map((mediaBlock, i) => {
              if (mediaBlock?.id === currentMediaId) {
                return <div key={i}>{mediaBlock?.id}</div>;
              }
            })}
          </div>
        )}
        {props.mediaBlocks && (
          <section className='admin-only mt-64'>
            <h1>Médias</h1>
            <ul>
              {props.mediaBlocks.map((mediaBlock, i) => (
                <li key={`mediablock-${i}`} className='mt-20 border-t border-black pt-20'>
                  <div data-tina-field={tinaField(mediaBlock!, 'id')}>{mediaBlock!.id}</div>
                  {mediaBlock?.videoURL && (
                    <video controls>
                      <source src={mediaBlock.videoURL} type='video/mp4' />
                    </video>
                  )}
                  {mediaBlock?.image && (
                    <Image
                      src={mediaBlock.image!}
                      width={mediaBlock.imageWidth!}
                      height={mediaBlock.imageHeight!}
                      alt='media'
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {currentMediaId && (
        <div
          className='fixed left-0 top-0 z-60 h-screen w-screen bg-[orange]'
          onClick={closeMedia}
        ></div>
      )}
    </section>
  );
}

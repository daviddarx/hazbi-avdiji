import TextContentMedias, { type CurrentMediaType } from '@/components/content/TextContentMedias';
import CustomMarkdown from '@/components/ui/CustomMarkdown';
import LoadedImage from '@/components/ui/LoadedImage';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import { mediaLinksURLPrefix } from '@/utils/core';
import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  const textContainer = useRef<HTMLDivElement | null>(null);
  const [currentMedia, setCurrentMedia] = useState<CurrentMediaType>(null);

  const handleMediaClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      const target = e.target as HTMLAnchorElement;
      const mediaURL = target.href.split(mediaLinksURLPrefix);
      if (mediaURL.length > 1) {
        requestAnimationFrame(() => {
          setCurrentMedia({ id: mediaURL[1], caption: target.innerText });
        });
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const textContainerElement = textContainer.current;

    if (textContainerElement) {
      textContainerElement.addEventListener('click', handleMediaClick);
    }

    return () => {
      if (textContainerElement) {
        textContainerElement.removeEventListener('click', handleMediaClick);
      }
    };
  }, []);

  return (
    <section className='grid-layout'>
      <div className='text-container grid-item-right relative'>
        {props.content && (
          <div ref={textContainer} data-tina-field={tinaField(props, 'content')}>
            <CustomMarkdown content={props.content} />
          </div>
        )}

        {props.mediaBlocks && (
          <TextContentMedias
            mediaBlocks={props.mediaBlocks}
            currentMedia={currentMedia}
            onClose={() => {
              setCurrentMedia(null);
            }}
          />
        )}

        {props.mediaBlocks && (
          <section className='admin-only mt-64'>
            <h1>Médias</h1>
            <ul>
              {props.mediaBlocks.map((mediaBlock, i) => (
                <li key={`mediablock-${i}`} className='border-strong mt-20 border-t pt-20'>
                  <div data-tina-field={tinaField(mediaBlock!, 'id')}>{mediaBlock!.id}</div>
                  {mediaBlock?.videoURL && (
                    <video controls>
                      <source src={mediaBlock.videoURL} type='video/mp4' />
                    </video>
                  )}
                  {mediaBlock?.image && (
                    <LoadedImage
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
    </section>
  );
}

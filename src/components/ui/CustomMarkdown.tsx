import { mediaLinksURLPrefix } from '@/utils/core';
import classNames from 'classnames';
import Image from 'next/image';
import { type Components, TinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text';

const components: Components<{
  CTA: {
    url: string;
    label: string;
    blank: boolean;
  };
}> = {
  a: (props) => {
    // Place media links on top of the close overlay in TextContent.tsx
    return (
      <a
        href={props?.url}
        className={props!.url.split(mediaLinksURLPrefix).length > 1 ? 'relative z-70' : ''}
        target='_blank'
      >
        {props?.children}
      </a>
    );
  },
  img: (props) => {
    const url = props!.url;
    const dimensions = props?.caption?.split('x'); // see formating in utils/tinas.ts > addImagesDimensions
    let width = 1920;
    let height = 1080;
    if (dimensions && dimensions.length > 1) {
      width = parseInt(dimensions[0]);
      height = parseInt(dimensions[1]);
    }
    return (
      <Image
        src={url}
        alt={props?.alt || ''}
        width={width}
        height={height}
        className='h-auto w-full'
      />
    );
  },
  CTA: (props) => {
    return (
      <a href={props.url} className='button' target={props.blank ? '_blank' : '_self'}>
        {props.label}
      </a>
    );
  },
};

export default function CustomMarkdown(props: {
  content: TinaMarkdownContent | TinaMarkdownContent[];
  className?: string;
}) {
  return (
    <div className={classNames('text-container', props.className)}>
      <TinaMarkdown content={props.content} components={components} />
    </div>
  );
}

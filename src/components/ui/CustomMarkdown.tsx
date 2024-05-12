import LoadedImage from '@/components/ui/LoadedImage';
import { mediaLinksURLPrefix } from '@/utils/core';
import classNames from 'classnames';
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
        className={
          props!.url.split(mediaLinksURLPrefix).length > 1
            ? 'border-light bg-themed hashover:hover:bg-themed-prev hashover:hover:border-strong rounded-[1em] px-[0.55em] py-[0.25em] font-bold !no-underline transition-colors duration-200 ease-out'
            : 'text-link'
        }
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
      <LoadedImage
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

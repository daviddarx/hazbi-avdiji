import LoadedImage from '@/components/ui/LoadedImage';
import PageLink from '@/components/ui/PageLink';
import { mediaLinksURLPrefix } from '@/utils/core';
import classNames from 'classnames';
import { type Components, TinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text';

const components: Components<{
  CTA: {
    url: string;
    label: string;
    blank: boolean;
  };
  subtitleTitle: {
    subtitle: string;
    title: string;
  };
}> = {
  a: (props) => {
    if (props!.url.split('/').length > 1) {
      return (
        <PageLink href={props!.url} className='text-link'>
          {props?.children}
        </PageLink>
      );
    } else if (props!.url.split(mediaLinksURLPrefix).length > 1) {
      return (
        <a href={props?.url} className='button inline'>
          {props?.children}
        </a>
      );
    } else {
      return (
        <a href={props?.url} className='text-link' target='_blank'>
          {props?.children}
        </a>
      );
    }
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
      <span className='image-custom-markdown border-light !my-spacer-80 block overflow-hidden rounded-cards-extended border p-gutter'>
        <span className='border-light block overflow-hidden rounded-cards border'>
          <LoadedImage
            src={url}
            alt={props?.alt || ''}
            width={width}
            height={height}
            className='h-auto w-full'
          />
        </span>
      </span>
    );
  },
  CTA: (props) => {
    return (
      <a href={props.url} className='button' target={props.blank ? '_blank' : '_self'}>
        {props.label}
      </a>
    );
  },
  subtitleTitle: (props) => {
    return (
      <div className='subtitle-title flex flex-col-reverse gap-16'>
        <h2>{props.title}</h2>
        <h3 className='subtitle'>{props.subtitle}</h3>
      </div>
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

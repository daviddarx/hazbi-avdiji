import PageLink from '@/components/ui/PageLink';
import type { Post } from '@/tina/types';
import { postRoute } from '@/utils/tina';
import { tinaField } from 'tinacms/dist/react';

export default function PostList(props: { post: Post }) {
  return (
    <PageLink
      href={`${postRoute}/${props.post._sys.filename}`}
      className='border-semi-transparent flex h-full flex-col justify-between gap-gutter rounded-cards p-gutter transition-colors hover:border-black hover:bg-theme-prev'
    >
      <h3 className='' data-tina-field={tinaField(props.post, 'title')}>
        {props.post.title}
      </h3>
      <div className='sr-only flex gap-16'>
        <span className='font-bold'>{props.post.category.title}</span>
      </div>
    </PageLink>
  );
}

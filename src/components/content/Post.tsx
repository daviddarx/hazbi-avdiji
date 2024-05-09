import PageLink from '@/components/ui/PageLink';
import type { Post } from '@/tina/types';
import { postRoute } from '@/utils/tina';
import { classNames } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';

export default function PostList(props: { post: Post }) {
  return (
    <PageLink
      href={`${postRoute}/${props.post._sys.filename}`}
      className={classNames(
        'group relative h-full hashover:hover:z-100',
        'before:bg-blurred before:border-semi-transparent before:pointer-events-none before:absolute before:-inset-80 before:scale-50 before:rounded-cards before:opacity-0',
        'before:transition-all before:duration-100 before:ease-in-quart',
        'hashover:hover:before:scale-100 hashover:hover:before:opacity-100 hashover:hover:before:duration-300 hashover:hover:before:ease-out-quart',
      )}
    >
      <div
        className={classNames(
          'border-semi-transparent relative z-10 flex h-full flex-col items-start justify-between gap-gutter rounded-cards p-gutter transition-colors',
          'hashover:hover:z-20 hashover:hover:border-black hashover:hover:bg-theme-prev',
        )}
      >
        <h3 data-tina-field={tinaField(props.post, 'title')}>{props.post.title}</h3>
        <div
          className={classNames(
            'tag absolute top-0 opacity-0 hashover:group-hover:-translate-y-1/2',
            'transition-[opacity,transform] delay-[0s,200ms] duration-[200ms,200ms] ease-out-quart',
            'hashover:group-hover:opacity-100 hashover:group-hover:delay-100 hashover:group-hover:duration-[300ms,300ms]',
          )}
        >
          {props.post.category.title}
        </div>
      </div>
    </PageLink>
  );
}

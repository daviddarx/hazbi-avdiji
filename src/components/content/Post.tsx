import PageLink from '@/components/ui/PageLink';
import QuoteIcon from '@/components/ui/QuoteIcon';
import type { Post } from '@/tina/types';
import { postRoute } from '@/utils/tina';
import { classNames } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';

export default function PostList(props: { post: Post }) {
  return (
    <PageLink
      href={`${postRoute}/${props.post._sys.filename}`}
      className={classNames(
        'group relative h-full hashover:hover:z-20',
        'before:bg-blurred before:border-light before:pointer-events-none before:absolute before:-inset-80 before:scale-50 before:rounded-cards before:opacity-0',
        'before:transition-all before:duration-100 before:ease-in-quart',
        'hashover:hover:before:scale-100 hashover:hover:before:opacity-100 hashover:hover:before:duration-300 hashover:hover:before:ease-out-quart',
      )}
    >
      <QuoteIcon
        className={classNames(
          'absolute right-40 top-4 z-20 !w-40 opacity-0',
          'transition-[opacity,transform] delay-[0s,200ms] duration-[200ms,200ms] ease-out-quart',
          'hashover:group-hover:-translate-y-[40%] hashover:group-hover:opacity-100 hashover:group-hover:delay-100 hashover:group-hover:duration-[300ms,300ms]',
        )}
      />
      <div
        className={classNames(
          'border-light relative z-10 flex h-full flex-col items-start justify-between gap-gutter rounded-cards p-gutter transition-colors',
          'hashover:hover:bg-themed-prev hashover:hover:border-strong',
        )}
      >
        <h3 data-tina-field={tinaField(props.post, 'title')}>{props.post.title}</h3>
        <div
          className={classNames(
            'tag absolute bottom-0 translate-y-full opacity-0',
            'transition-[opacity,transform] delay-[0s,200ms] duration-[200ms,200ms] ease-out-quart',
            'hashover:group-hover:translate-y-1/2 hashover:group-hover:opacity-100 hashover:group-hover:delay-100 hashover:group-hover:duration-[300ms,300ms]',
          )}
        >
          {props.post.category.title}
        </div>
      </div>
    </PageLink>
  );
}

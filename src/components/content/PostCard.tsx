import Icon from '@/components/ui/Icon';
import PageLink from '@/components/ui/PageLink';
import QuoteIcon from '@/components/ui/QuoteIcon';
import type { Post } from '@/tina/types';
import { postRoute } from '@/utils/tina';
import { classNames } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';

export default function PostCard({
  post,
  direction,
  className = '',
}: {
  post: Post;
  direction?: 'left' | 'right';
  className?: string;
}) {
  return (
    <PageLink
      href={`${postRoute}/${post._sys.filename}`}
      className={classNames(
        'group relative block h-full rounded-cards hashover:hover:z-60',
        'before:bg-blurred before:border-light before:pointer-events-none before:absolute before:-inset-40 before:scale-50 before:rounded-cards-extended before:border before:opacity-0',
        'before:transition-all before:duration-100 before:ease-in-quart',
        'hashover:hover:before:scale-100 hashover:hover:before:opacity-100 hashover:hover:before:duration-300 hashover:hover:before:ease-out-quart',
        className,
      )}
    >
      <QuoteIcon
        className={classNames(
          'absolute right-40 top-4 z-20 !w-40 opacity-0',
          'transition-[opacity,transform] delay-[0s,200ms] duration-[200ms,200ms] ease-out-quart',
          'hashover:group-hover:-translate-y-[40%] hashover:group-hover:opacity-100 hashover:group-hover:delay-100 hashover:group-hover:duration-[300ms,300ms]',
        )}
      />
      <span
        className={classNames(
          'border-light relative z-10 flex h-full flex-col items-start justify-between gap-40 rounded-cards border transition-colors',
          'px-20 py-16 md:px-32 md:py-28 lg:px-44 lg:py-40',
          'hashover:hover:bg-themed-prev hashover:hover:border-strong dark:hashover:hover:border-light',
        )}
      >
        <h3
          data-tina-field={tinaField(post, 'title')}
          dangerouslySetInnerHTML={{ __html: post.title }}
          className='lg:pb-40'
        />
        <span
          className={classNames(
            'tag absolute bottom-0 translate-y-full opacity-0',
            'transition-[opacity,transform] delay-[0s,200ms] duration-[200ms,200ms] ease-out-quart',
            'hashover:group-hover:translate-y-1/2 hashover:group-hover:opacity-100 hashover:group-hover:delay-100 hashover:group-hover:duration-[300ms,300ms]',
          )}
        >
          {post.category.title}
        </span>
        {direction && (
          <Icon name='arrow' className={direction === 'left' ? '-scale-x-100' : 'self-end'} />
        )}
      </span>
    </PageLink>
  );
}

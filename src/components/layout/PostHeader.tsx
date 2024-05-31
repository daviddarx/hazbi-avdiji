import PageLink from '@/components/ui/PageLink';
import t from '@/content/translations';
import type { PostPartsFragment } from '@/tina/types';
import { tinaField } from 'tinacms/dist/react';

export default function PageHeader({
  post,
  postListLink,
}: {
  post: PostPartsFragment;
  postListLink: string;
}) {
  return (
    <header className='grid-layout'>
      <div className='grid-item-left mb-v-spacer-120'>
        <h2 className='subtitle mb-v-spacer-120 block' data-tina-field={tinaField(post, 'title')}>
          {t.post}
        </h2>
        <h1 className='mb-spacer-24' data-tina-field={tinaField(post, 'title')}>
          {post.title}
        </h1>
        <PageLink
          href={postListLink}
          className='button tag'
          data-tina-field={tinaField(post, 'category')}
        >
          {post.category.title}
        </PageLink>
      </div>
    </header>
  );
}

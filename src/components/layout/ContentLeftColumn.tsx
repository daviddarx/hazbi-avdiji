import PageLink from '@/components/ui/PageLink';
import { PageQuery, PostQuery } from '@/tina/types';
import classNames from 'classnames';
import { tinaField } from 'tinacms/dist/react';

export default function ContentLeftColumn({
  title,
  tinaFieldObject,
  postCategoryName,
  postCategoryLink,
}: {
  title: string;
  tinaFieldObject: PageQuery['page'] | PostQuery['post'];
  postCategoryName?: string;
  postCategoryLink?: string;
}) {
  return (
    <div className='grid-item-right-leftover pr-32 max-lg:hidden'>
      <div
        className={classNames(
          'border-light mt-12 py-24',
          postCategoryName && postCategoryLink ? 'border-y' : 'border-t',
        )}
      >
        <h1 className='subtitle block' data-tina-field={tinaField(tinaFieldObject, 'title')}>
          {title}
        </h1>
      </div>
      {postCategoryName && postCategoryLink && (
        <div className='mt-28'>
          <PageLink
            href={postCategoryLink}
            className='button tag'
            data-tina-field={tinaField(tinaFieldObject as PostQuery['post'], 'category')}
          >
            {postCategoryName}
          </PageLink>
        </div>
      )}
    </div>
  );
}

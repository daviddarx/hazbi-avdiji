import TextContent from '@/components/content/TextContent';
import Metas from '@/components/layout/Metas';
import { PostResult } from '@/types/';
import { useTina } from 'tinacms/dist/react';
import { tinaField } from 'tinacms/dist/react';

export default function Post(props: PostResult) {
  const data = useTina(props);
  const { post } = data.data;

  return (
    <div>
      <Metas title={post.title} />
      <div className='grid-layout'>
        <header className='text-container grid-item-left mb-spacer-20'>
          <h1 data-tina-field={tinaField(post, 'title')}>{post.title}</h1>
          <div className='tag' data-tina-field={tinaField(post, 'category')}>
            {post.category.title}
          </div>
        </header>
      </div>
      <div className='mb-spacer-120 flex flex-col gap-spacer-80'>
        {post.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PostBlocksTextContent': {
              return <TextContent {...block} key={i} />;
            }
          }
        })}
      </div>
    </div>
  );
}

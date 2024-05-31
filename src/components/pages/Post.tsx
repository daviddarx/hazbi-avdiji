import TextContent from '@/components/content/TextContent';
import Metas from '@/components/layout/Metas';
import PostHeader from '@/components/layout/PostHeader';
import { PostResult } from '@/types/';
import { useTina } from 'tinacms/dist/react';

export default function Post(props: PostResult) {
  const data = useTina(props);
  const { post } = data.data;

  return (
    <article>
      <Metas title={post.title} />
      <PostHeader post={post} />

      <div className='mb-v-spacer-120 flex flex-col gap-spacer-80'>
        {post.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PostBlocksTextContent': {
              return <TextContent {...block} key={i} />;
            }
          }
        })}
      </div>
    </article>
  );
}

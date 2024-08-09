import { mediaLinksURLPrefix } from './core';
import { CategoryConnectionEdges, Post, PostConnectionEdges } from '@/tina/types';
import { type Template, type TinaField, tinaTableTemplate } from 'tinacms';

export const postRoute = '/idee-recue';

export const slugify = (value = 'no-value') => {
  return `${value
    .toLowerCase()
    .replace(/ /g, '-')
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')}`;
};

export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = src;
  });
};

export const getVideoDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.addEventListener('loadedmetadata', () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
    });
    video.src = src;
  });
};

export const addImagesDimensions = async (obj: any): Promise<any> => {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(async (item: any) => addImagesDimensions(item)));
  } else if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj);
    await Promise.all(
      keys.map(async (key: string) => {
        // add dimensions for image fields
        if (key === 'image') {
          if (obj[key]) {
            const { width, height } = await getImageDimensions(obj[key]);
            obj.imageWidth = width;
            obj.imageHeight = height;
          } else {
            obj.imageWidth = 0;
            obj.imageHeight = 0;
          }
          // add dimensions for images in rich-text
        } else if (key === 'type' && obj[key] === 'img') {
          const { width, height } = await getImageDimensions(obj.url);
          obj.caption = `${width}x${height}`;
        } else if (key === 'videoURL') {
          if (obj[key]) {
            const { width, height } = await getVideoDimensions(obj[key]);
            obj.imageWidth = width;
            obj.imageHeight = height;
          } else {
            obj.imageWidth = 0;
            obj.imageHeight = 0;
          }
        } else {
          await addImagesDimensions(obj[key]);
        }
      }),
    );
  }
  return obj;
};

export const richTextTemplates: Template[] = [
  {
    name: 'CTA',
    label: 'CTA',
    fields: [
      {
        name: 'url',
        label: 'URL',
        type: 'string',
      },
      {
        name: 'label',
        label: 'Label',
        type: 'string',
      },
      {
        name: 'blank',
        label: 'External link',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'subtitleTitle',
    label: 'Subtitle & Title',
    fields: [
      { name: 'subtitle', label: 'Subtitle', type: 'string' },
      { name: 'title', label: 'Title', type: 'string' },
    ],
  },
  tinaTableTemplate,
];

export const imageFields: TinaField[] = [
  { name: 'image', label: 'Image', type: 'image' },
  { name: 'imageWidth', label: 'Image width', type: 'number' },
  { name: 'imageHeight', label: 'Image height', type: 'number' },
];

export const textContentTemplate: Template = {
  name: 'textContent',
  label: 'Text-Content',
  ui: {
    itemProps: () => {
      return { label: `Text-Content` };
    },
  },
  fields: [
    {
      name: 'content',
      label: 'Content',
      type: 'rich-text',
      description: `
        To link text to exisiting media-blocks (below), select the text and add a link to it.
        Set the URL of the link as follow: ${mediaLinksURLPrefix}[media-block id].
        For example: '${mediaLinksURLPrefix}image-tweet' to open a media-block with id 'image-tweet'`,
      templates: richTextTemplates,
    },
    {
      name: 'mediaBlocks',
      label: 'Media Blocks',
      type: 'object',
      list: true,
      fields: [
        { name: 'id', label: 'ID', type: 'string', required: true },
        { name: 'title', label: 'Title', type: 'string' },
        { name: 'videoURL', label: 'Video URL', type: 'string' },
        ...imageFields,
      ],
      ui: {
        itemProps: (item) => {
          return { label: `Media (${item.id})` };
        },
      },
    },
  ],
};

/**
 * Post titles have the format XX--[title] for the titles
 * to help hazbi have an overview on the list in the admin.
 * Let's remove this number at the beginning
 */
export const formatPostTitle = (post: Post) => {
  const parsedTitle = post.title.split('--');
  post.title = parsedTitle.length > 1 ? parsedTitle[1] : parsedTitle[0];
};

export const sortPostsToCategories = (
  posts: PostConnectionEdges[],
  categories: CategoryConnectionEdges[],
) => {
  const categoriesMap = new Map();
  categories.forEach((category, index) => {
    if (category?.node?.id) {
      categoriesMap.set(category.node.id, index);
    }
  });

  posts.sort((a, b) => {
    const indexA = categoriesMap.get(a?.node?.category?.id);
    const indexB = categoriesMap.get(b?.node?.category?.id);

    return indexA - indexB;
  });
};

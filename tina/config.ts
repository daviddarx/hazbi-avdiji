import { addImagesDimensions, imageFields, richTextTemplates, slugify } from '../src/utils/tina';
import { postRoute } from '../src/utils/tina';
import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads',
    },
  },
  schema: {
    collections: [
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        format: 'mdx',
        ui: {
          router: (props) => {
            if (props.document._sys.filename === 'home') {
              return '/';
            } else {
              return `/${props.document._sys.filename}`;
            }
          },
          filename: {
            slugify: (values) => {
              return slugify(values.title);
            },
          },
          beforeSubmit: async ({ values }: { values: Record<string, any> }) => {
            return await addImagesDimensions(values);
          },
        },
        fields: [
          { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
          {
            name: 'blocks',
            label: 'Blocks',
            type: 'object',
            list: true,
            templates: [
              {
                name: 'textContent',
                label: 'Text-Content',
                ui: {
                  itemProps: (item) => {
                    return { label: `Text-Content: ${item.title}` };
                  },
                  defaultItem: {
                    title: 'Title',
                  },
                },
                fields: [
                  { name: 'title', label: 'Title', type: 'string', required: true },
                  {
                    name: 'description',
                    label: 'Description',
                    type: 'rich-text',
                    templates: richTextTemplates,
                  },
                  {
                    name: 'links',
                    label: 'Links',
                    type: 'object',
                    list: true,
                    ui: {
                      itemProps: (item) => {
                        return { label: item.label };
                      },
                    },
                    fields: [
                      { name: 'href', label: 'Href', type: 'string', required: true },
                      { name: 'label', label: 'Label', type: 'string', required: true },
                      {
                        name: 'style',
                        label: 'Style',
                        type: 'string',
                        options: ['primary', 'secondary'],
                        required: true,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'postList',
                label: 'Post-List',
                ui: {
                  itemProps: (item) => {
                    return { label: `Post-List: ${item.title}` };
                  },
                  defaultItem: {
                    title: 'Post-List title',
                    hideTitle: false,
                  },
                },
                fields: [
                  { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
                  { name: 'hideTitle', label: 'Hide Title?', type: 'boolean' },
                  {
                    name: 'description',
                    label: 'Description',
                    type: 'rich-text',
                    templates: richTextTemplates,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'navigation',
        label: 'Navigation',
        path: 'content/navigation',
        format: 'md',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          global: true /* Prioritize it back in the side-bar of the detail pages admin */,
        },
        fields: [
          {
            name: 'links',
            label: 'Links',
            type: 'object',
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item.label };
              },
            },
            fields: [
              { name: 'label', label: 'Label', type: 'string', required: true },
              { name: 'link', label: 'Link', type: 'string', required: true },
            ],
          },
        ],
      },
      {
        name: 'category',
        label: 'Categories',
        path: 'content/categories',
        ui: {
          filename: {
            slugify: (values) => {
              return slugify(values.title);
            },
          },
        },
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            isTitle: true,
            required: true,
          },
          {
            name: 'priority',
            label: 'Priority',
            type: 'number',
            required: true,
          },
        ],
      },
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        format: 'mdx',
        defaultItem: () => {
          return {
            createdAt: new Date(),
            published: true,
          };
        },
        ui: {
          router: (props) => {
            return `${postRoute}/${props.document._sys.filename}`;
          },
          filename: {
            slugify: (values) => {
              return slugify(values.title);
            },
          },
          beforeSubmit: async ({ values }: { values: Record<string, any> }) => {
            const valuesWithImageDimensions = await addImagesDimensions(values);

            return {
              ...valuesWithImageDimensions,
              updatedAt: new Date(),
            };
          },
        },
        fields: [
          { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
          {
            name: 'createdAt',
            label: 'Created at',
            type: 'datetime',
            required: true,
            ui: {
              dateFormat: 'MMMM DD YYYY',
              timeFormat: 'HH:mm',
            },
          },
          {
            name: 'updatedAt',
            label: 'Updated at',
            type: 'datetime',
            ui: {
              dateFormat: 'MMMM DD YYYY',
              timeFormat: 'HH:mm',
            },
          },
          {
            name: 'published',
            label: 'Published',
            type: 'boolean',
          },
          {
            name: 'category',
            label: 'Category',
            type: 'reference',
            collections: ['category'],
            required: true,
          },
          { name: 'body', label: 'Body', type: 'rich-text', templates: richTextTemplates },
          ...imageFields,
        ],
      },
    ],
  },
});

import { addImagesDimensions, postRoutes, slugify, textContentTemplate } from '../src/utils/tina';
import { defineConfig } from 'tinacms';

const translationOptionComponent = (props: { title?: string }, _internalSys: { path: string }) => {
  const locale = _internalSys.path.includes('/en/') ? 'EN' : 'FR';
  const label = props.title || _internalSys.path;
  return `${locale}: ${label}`;
};

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
            const locale = props.document._sys.path.includes('/en/') ? 'en' : 'fr';
            const localePrefix = locale === 'fr' ? '' : `/${locale}`;
            if (props.document._sys.filename === 'home') {
              return `${localePrefix}/`;
            } else {
              return `${localePrefix}/${props.document._sys.filename}`;
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
          { name: 'longTitle', label: 'Long-Title', type: 'string' },
          {
            name: 'lead',
            label: 'Lead-text',
            type: 'rich-text',
          },
          {
            name: 'blocks',
            label: 'Blocks',
            type: 'object',
            list: true,
            templates: [
              textContentTemplate,
              {
                name: 'homeContent',
                label: 'Home-Content',
                ui: {
                  itemProps: () => {
                    return { label: `Home-Content` };
                  },
                },
                fields: [
                  { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
                  {
                    name: 'introduction',
                    label: 'Introduction',
                    type: 'rich-text',
                    required: true,
                  },
                ],
              },
              {
                name: 'postList',
                label: 'Post-List',
                ui: {
                  itemProps: () => {
                    return { label: 'Post-List' };
                  },
                  defaultItem: {
                    title: 'Post-List title',
                  },
                },
                fields: [
                  {
                    name: 'title',
                    label: "Title (won't be displayed)",
                    type: 'string',
                    isTitle: true,
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'translationOf',
            label: 'Translation of',
            type: 'reference',
            collections: ['page'],
            description: 'Link to the corresponding page in the other language (set on both sides)',
            ui: { optionComponent: translationOptionComponent },
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
              { name: 'isPostPage', label: 'Is it the post page?', type: 'boolean' },
            ],
          },
        ],
      },
      {
        name: 'footerNavigation',
        label: 'Footer Navigation',
        path: 'content/footer-navigation',
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
          {
            name: 'translationOf',
            label: 'Translation of',
            type: 'reference',
            collections: ['category'],
            description:
              'Link to the corresponding category in the other language (set on both sides)',
            ui: { optionComponent: translationOptionComponent },
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
            const locale = props.document._sys.path.includes('/en/') ? 'en' : 'fr';
            const localePrefix = locale === 'fr' ? '' : `/${locale}`;
            return `${localePrefix}${postRoutes[locale]}/${props.document._sys.filename}`;
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
          {
            name: 'blocks',
            label: 'Blocks',
            type: 'object',
            list: true,
            templates: [textContentTemplate],
          },
          {
            name: 'translationOf',
            label: 'Translation of',
            type: 'reference',
            collections: ['post'],
            description: 'Link to the corresponding post in the other language (set on both sides)',
            ui: { optionComponent: translationOptionComponent },
          },
        ],
      },
    ],
  },
});

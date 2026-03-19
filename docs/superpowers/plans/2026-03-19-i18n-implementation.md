# i18n Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **IMPORTANT:** Before writing any code touching TinaCMS or Next.js i18n APIs, use context7 to look up current documentation:
> - TinaCMS: resolve library ID for "tinacms", then query for i18n/internationalization patterns
> - Next.js: resolve library ID for "next.js", then query for Pages Router i18n configuration
> Verify all API usage against current docs rather than relying on training data.

**Goal:** Add English as a second language to the Hazbi Avdiji website, with folder-based TinaCMS content, locale-prefixed URLs, translated slugs, and a language switcher UI.

**Architecture:** Next.js Pages Router built-in i18n with sub-path routing (`/fr/`, `/en/`). Content organized in locale subfolders within TinaCMS collections. Translation linking via bidirectional `translationOf` reference fields. Language switcher component following the existing DarkModeSwitcher pattern.

**Tech Stack:** Next.js 15 (Pages Router), TinaCMS, React 18, Redux Toolkit, HeadlessUI, Framer Motion, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-19-i18n-design.md`

---

## Chunk 1: Infrastructure — Next.js i18n config, translations refactor, useTranslations hook

### Task 1: Configure Next.js i18n in next.config.js

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Add i18n config, redirects, and rewrites**

Update `next.config.js` to add the i18n block, the redirect for forcing `/fr/` prefix, and the rewrite for English post routes:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  async redirects() {
    return [
      {
        source: '/:path((?!fr|en|admin|_next|api|uploads|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|hazbi-avdiji\\.jpg).*)',
        destination: '/fr/:path',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/misconception/:slug',
        destination: '/idee-recue/:slug',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
      },
    ],
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts without errors. Visiting `http://localhost:3000` should redirect to `http://localhost:3000/fr/`.

- [ ] **Step 3: Commit**

```bash
git add next.config.js
git commit -m "feat(i18n): configure Next.js i18n with locale redirects and rewrites"
```

### Task 2: Refactor translations.ts to locale-keyed structure

**Files:**
- Modify: `content/translations.ts`

- [ ] **Step 1: Refactor to locale-keyed structure**

Replace the entire contents of `content/translations.ts` with a locale-keyed object. Read the current file first to preserve all existing French strings exactly:

```ts
export type Locale = 'fr' | 'en';

const t: Record<Locale, {
  logoTitle: string;
  logoSubline: string;
  metaData: {
    title: (pageTitle?: string) => string;
    description: string;
    url: string;
  };
  allPosts: string;
  post: string;
  postResults: (amount: number) => string;
  postReadMore: string;
  errorPage: {
    title: string;
  };
  textContentMediaCloseLabel: {
    image: string;
    video: string;
  };
  mobileNavigation: {
    title: string;
  };
  darkModeSwitcher: {
    title: string;
    options: {
      light: string;
      dark: string;
    };
  };
  languageSwitcher: {
    title: string;
    options: {
      fr: string;
      en: string;
    };
  };
}> = {
  fr: {
    logoTitle: 'Dr. Hazbi Avdiji',
    logoSubline: 'Votre généraliste en diversité et inclusion',
    metaData: {
      title: (pageTitle?: string) =>
        `${
          pageTitle ? `${pageTitle} – ` : ''
        }Hazbi Avdiji – Votre généraliste en diversité et inclusion (D&I)`,
      description:
        'Accompagnement et conseil pour initiatives D&I en Suisse romande, déconstruction des idées reçues sur la D&I.',
      url: 'https://avdiji.com/fr/',
    },
    allPosts: 'Tout',
    post: 'Idée reçue',
    postResults: (amount: number) => (amount === 1 ? 'Idée reçue' : 'Idées reçues'),
    postReadMore: 'A lire aussi',
    errorPage: {
      title: "Cette page n'existe pas",
    },
    textContentMediaCloseLabel: {
      image: "Fermer l'image",
      video: 'Fermer la vidéo',
    },
    mobileNavigation: {
      title: 'Navigation',
    },
    darkModeSwitcher: {
      title: 'Apparence',
      options: {
        light: 'Clair',
        dark: 'Sombre',
      },
    },
    languageSwitcher: {
      title: 'Langue',
      options: {
        fr: 'Français',
        en: 'English',
      },
    },
  },
  en: {
    logoTitle: 'Dr. Hazbi Avdiji',
    logoSubline: 'Your generalist in diversity and inclusion',
    metaData: {
      title: (pageTitle?: string) =>
        `${
          pageTitle ? `${pageTitle} – ` : ''
        }Hazbi Avdiji – Your generalist in diversity and inclusion (D&I)`,
      description:
        'Support and consulting for D&I initiatives in French-speaking Switzerland, debunking misconceptions about D&I.',
      url: 'https://avdiji.com/en/',
    },
    allPosts: 'All',
    post: 'Misconception',
    postResults: (amount: number) => (amount === 1 ? 'Misconception' : 'Misconceptions'),
    postReadMore: 'Read also',
    errorPage: {
      title: 'This page does not exist',
    },
    textContentMediaCloseLabel: {
      image: 'Close image',
      video: 'Close video',
    },
    mobileNavigation: {
      title: 'Navigation',
    },
    darkModeSwitcher: {
      title: 'Appearance',
      options: {
        light: 'Light',
        dark: 'Dark',
      },
    },
    languageSwitcher: {
      title: 'Language',
      options: {
        fr: 'Français',
        en: 'English',
      },
    },
  },
};

export default t;
```

- [ ] **Step 2: Commit**

```bash
git add content/translations.ts
git commit -m "feat(i18n): refactor translations.ts to locale-keyed structure with English"
```

### Task 3: Create useTranslations hook

**Files:**
- Create: `src/hooks/useTranslations.ts`

- [ ] **Step 1: Create the hook**

```ts
import t, { type Locale } from '@/content/translations';
import { useRouter } from 'next/router';

export default function useTranslations() {
  const { locale } = useRouter();
  return t[(locale as Locale) || 'fr'];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useTranslations.ts
git commit -m "feat(i18n): add useTranslations hook"
```

### Task 4: Make postRoute locale-aware

**Files:**
- Modify: `src/utils/tina.ts`

- [ ] **Step 1: Replace postRoute with postRoutes**

In `src/utils/tina.ts`, replace:
```ts
export const postRoute = '/idee-recue';
```

With:
```ts
export const postRoutes: Record<string, string> = {
  fr: '/idee-recue',
  en: '/misconception',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/tina.ts
git commit -m "feat(i18n): make postRoute locale-aware"
```

### Task 5: Update _document.tsx for dynamic locale

**Files:**
- Modify: `src/pages/_document.tsx`

- [ ] **Step 1: Use __NEXT_DATA__ locale**

Next.js Pages Router automatically sets the `lang` attribute on `<Html>` when i18n is configured. Change `lang='en'` to remove the hardcoded value — Next.js will handle it:

In `src/pages/_document.tsx`, change:
```tsx
<Html lang='en'>
```
To:
```tsx
<Html>
```

Next.js i18n automatically sets `<html lang="fr">` or `<html lang="en">` based on the current locale.

- [ ] **Step 2: Commit**

```bash
git add src/pages/_document.tsx
git commit -m "feat(i18n): let Next.js set html lang attribute from locale"
```

---

## Chunk 2: TinaCMS schema changes and content migration

### Task 6: Add translationOf field to TinaCMS schema

**Files:**
- Modify: `tina/config.ts`

- [ ] **Step 1: Add translationOf reference to page, post, and category collections**

In `tina/config.ts`, add a `translationOf` field to each of the `page`, `post`, and `category` collections. Add it at the end of each collection's `fields` array.

For the `page` collection, add:
```ts
{
  name: 'translationOf',
  label: 'Translation of',
  type: 'reference',
  collections: ['page'],
  description: 'Link to the corresponding page in the other language (set on both sides)',
},
```

For the `post` collection, add:
```ts
{
  name: 'translationOf',
  label: 'Translation of',
  type: 'reference',
  collections: ['post'],
  description: 'Link to the corresponding post in the other language (set on both sides)',
},
```

For the `category` collection, add:
```ts
{
  name: 'translationOf',
  label: 'Translation of',
  type: 'reference',
  collections: ['category'],
  description: 'Link to the corresponding category in the other language (set on both sides)',
},
```

- [ ] **Step 2: Update the post collection's ui.router to use locale-aware routes**

In `tina/config.ts`, the post collection has:
```ts
ui: {
  router: (props) => {
    return `${postRoute}/${props.document._sys.filename}`;
  },
```

Import `postRoutes` instead of `postRoute` from `../src/utils/tina` and update:
```ts
ui: {
  router: (props) => {
    const locale = props.document._sys.path.includes('/en/') ? 'en' : 'fr';
    return `/${locale}${postRoutes[locale]}/${props.document._sys.filename}`;
  },
```

Also update the page collection's `ui.router`:
```ts
ui: {
  router: (props) => {
    const locale = props.document._sys.path.includes('/en/') ? 'en' : 'fr';
    if (props.document._sys.filename === 'home') {
      return `/${locale}/`;
    } else {
      return `/${locale}/${props.document._sys.filename}`;
    }
  },
```

- [ ] **Step 3: Update the import**

Change `import { postRoute } from '../src/utils/tina';` to `import { postRoutes } from '../src/utils/tina';` (note: also update the destructured import on the same line if `postRoute` is there).

- [ ] **Step 4: Run TinaCMS build to verify schema**

Run: `npx tinacms build`
Expected: Build succeeds. The `tina/__generated__` folder is updated with the new `translationOf` fields.

- [ ] **Step 5: Commit**

```bash
git add tina/config.ts tina/__generated__/
git commit -m "feat(i18n): add translationOf reference fields to TinaCMS schema"
```

### Task 7: Migrate existing French content to fr/ subfolders

**Files:**
- Move: all files in `content/pages/` → `content/pages/fr/`
- Move: all files in `content/posts/` → `content/posts/fr/`
- Move: all files in `content/categories/` → `content/categories/fr/`
- Move: `content/navigation/navigation.md` → `content/navigation/fr/navigation.md`
- Move: `content/footer-navigation/footer-navigation.md` → `content/footer-navigation/fr/footer-navigation.md`

- [ ] **Step 1: Create locale subdirectories and move files**

```bash
# Pages
mkdir -p content/pages/fr
git mv content/pages/*.mdx content/pages/fr/

# Posts
mkdir -p content/posts/fr
git mv content/posts/*.mdx content/posts/fr/

# Categories
mkdir -p content/categories/fr
git mv content/categories/*.md content/categories/fr/

# Navigation
mkdir -p content/navigation/fr
git mv content/navigation/navigation.md content/navigation/fr/navigation.md

# Footer navigation
mkdir -p content/footer-navigation/fr
git mv content/footer-navigation/footer-navigation.md content/footer-navigation/fr/footer-navigation.md
```

- [ ] **Step 2: Verify TinaCMS can still find the files**

Run: `npx tinacms build`
Expected: Build succeeds. TinaCMS discovers files in the `fr/` subfolders since collection paths (`content/pages`, etc.) include subdirectories.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(i18n): migrate all existing content to fr/ subfolders"
```

### Task 8: Create English content translations

**Files:**
- Create: `content/pages/en/` — all English page translations
- Create: `content/posts/en/` — all English post translations
- Create: `content/categories/en/` — all English category translations
- Create: `content/navigation/en/navigation.md`
- Create: `content/footer-navigation/en/footer-navigation.md`

- [ ] **Step 1: Create English directory structure**

```bash
mkdir -p content/pages/en content/posts/en content/categories/en content/navigation/en content/footer-navigation/en
```

- [ ] **Step 2: Create English category files**

Read each French category file in `content/categories/fr/` and create an English counterpart in `content/categories/en/` with translated title. Preserve the same frontmatter structure. Add a `translationOf` field pointing to the French counterpart, and update the French file to point back.

Category translations:
- `autres.md` → `others.md` (Autres → Others)
- `en-pratique.md` → `in-practice.md` (En pratique → In practice)
- `etat-desprit.md` → `mindset.md` (État d'esprit → Mindset)
- `genre.md` → `gender.md` (Genre → Gender)
- `handicaps.md` → `disabilities.md` (Handicaps → Disabilities)
- `queerness.md` → `queerness.md` (same)
- `racialisation.md` → `racialization.md` (Racialisation → Racialization)

- [ ] **Step 3: Create English navigation files**

Read `content/navigation/fr/navigation.md` and create `content/navigation/en/navigation.md` with translated labels and locale-appropriate links (prefixed with `/en/`).

Read `content/footer-navigation/fr/footer-navigation.md` and create `content/footer-navigation/en/footer-navigation.md` with translated labels and `/en/` prefixed links.

- [ ] **Step 4: Create English page files**

For each page in `content/pages/fr/`, create an English counterpart in `content/pages/en/`. Translate all text content (title, longTitle, lead, blocks). Use translated slugs for filenames where appropriate:
- `home.mdx` → `home.mdx`
- `idees-recues.mdx` → `misconceptions.mdx`
- `portrait.mdx` → `portrait.mdx`
- `services.mdx` → `services.mdx`
- `contact.mdx` → `contact.mdx`
- `impressum.mdx` → `impressum.mdx`

Add bidirectional `translationOf` references between French and English pages.

Do NOT translate `test.mdx` — it can be left as French-only or removed.

- [ ] **Step 5: Create English post files**

For each post in `content/posts/fr/`, create an English counterpart in `content/posts/en/`. Translate:
- The title (keep the `XX--` prefix format for admin ordering)
- All text content blocks
- The category reference (point to the English category)

Add bidirectional `translationOf` references between French and English posts.

Post filename translations (French → English):
- `abaissement-trottoir.mdx` → `sidewalk-lowering.mdx`
- `apparence.mdx` → `appearance.mdx`
- `assez-de-femmes-postes-responsabilite.mdx` → `enough-women-leadership.mdx`
- `darwinisme.mdx` → `darwinism.mdx`
- `egalite-hommes-femmes-avant-tout.mdx` → `gender-equality-first.mdx`
- `embauche-handicap.mdx` → `hiring-disability.mdx`
- `embauche.mdx` → `hiring.mdx`
- `feminisme-masculinisme.mdx` → `feminism-masculinism.mdx`
- `formation-sur-les-biais.mdx` → `bias-training.mdx`
- `genre-biologique.mdx` → `biological-gender.mdx`
- `le-racisme-anti-blancs-existe.mdx` → `reverse-racism-exists.mdx`
- `masculinite-toxique.mdx` → `toxic-masculinity.mdx`
- `minorites-se-plaignent-pour-rien.mdx` → `minorities-complain-for-nothing.mdx`
- `modele-medical-handicap.mdx` → `medical-model-disability.mdx`
- `montrer-orientation.mdx` → `showing-orientation.mdx`
- `ne-devraient-pas-faire-diversite.mdx` → `should-not-do-diversity.mdx`
- `ne-discrimine-pas-personnellement.mdx` → `dont-discriminate-personally.mdx`
- `ne-suis-pas-privilegie.mdx` → `not-privileged.mdx`
- `ne-vois-pas-les-differences.mdx` → `dont-see-differences.mdx`
- `notre-organisation-assez-diverse.mdx` → `organization-diverse-enough.mdx`
- `on-ne-peut-plus-rien-dire.mdx` → `cant-say-anything-anymore.mdx`
- `politiques-specifiques.mdx` → `specific-policies.mdx`
- `regret-transitions.mdx` → `transition-regret.mdx`
- `rien-a-gagner.mdx` → `nothing-to-gain.mdx`
- `soucis-embaucher-etrangers.mdx` → `concerns-hiring-foreigners.mdx`

- [ ] **Step 6: Verify TinaCMS discovers all content**

Run: `npx tinacms build`
Expected: Build succeeds with all French and English content discovered.

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat(i18n): add all English content translations with bidirectional references"
```

---

## Chunk 3: Update page routing and data fetching

### Task 9: Update catch-all page for i18n

**Files:**
- Modify: `src/pages/[[...slug]].tsx`

- [ ] **Step 1: Update getStaticProps to use locale**

In `src/pages/[[...slug]].tsx`, update `getStaticProps` to receive `locale` from context and use it to fetch locale-specific content:

Change the function signature from:
```ts
export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
```
To:
```ts
export const getStaticProps = async ({ params, locale }: { params: { slug?: string[] }; locale: string }) => {
```

Update all `relativePath` queries to include the locale prefix:
- `client.queries.navigation({ relativePath: 'navigation.md' })` → `client.queries.navigation({ relativePath: \`${locale}/navigation.md\` })`
- `client.queries.footerNavigation({ relativePath: 'footer-navigation.md' })` → `client.queries.footerNavigation({ relativePath: \`${locale}/footer-navigation.md\` })`
- `client.queries.page({ relativePath: \`${pageMdPath}.mdx\` })` → `client.queries.page({ relativePath: \`${locale}/${pageMdPath}.mdx\` })`

Also update the `t.allPosts` reference in `getStaticProps`. Since this is server-side code, hooks cannot be used. Import `t` directly and index by locale:

```ts
import t, { type Locale } from '@/content/translations';
```

Then replace `t.allPosts` with `t[locale as Locale].allPosts` where the "All" filter label is built.

Also pass `locale` in the returned props so components can access it:
```ts
return {
  props: {
    locale,
    navigationProps: { ...navigationResult },
    // ... rest
  },
};
```

- [ ] **Step 2: Update getStaticPaths to generate paths for all locales**

Replace the current `getStaticPaths`:
```ts
export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const pageConnectionResult = await client.queries.pageConnection();
  const paths: Array<{ params: { slug: string[] }; locale: string }> = [];

  pageConnectionResult.data.pageConnection.edges!.map((edge) => {
    const fileName = edge!.node!._sys.filename;
    const filePath = edge!.node!._sys.path;
    // Extract locale from path: "content/pages/fr/home.mdx" → "fr"
    const pathParts = filePath.split('/');
    const locale = pathParts[pathParts.indexOf('pages') + 1];

    if (fileName === 'home') {
      paths.push({ params: { slug: [''] }, locale });
    } else {
      paths.push({ params: { slug: [fileName] }, locale });
    }
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
```

- [ ] **Step 3: Pass translationOf data to props**

After fetching the page, extract the `translationOf` reference and resolve the translation URL. Add to `getStaticProps`:

```ts
let translationSlug: string | null = null;
let translationLocale: string | null = null;

if (pageResult.data.page.translationOf) {
  const refPath = pageResult.data.page.translationOf._sys.path;
  const refParts = refPath.split('/');
  translationLocale = refParts[refParts.indexOf('pages') + 1];
  translationSlug = pageResult.data.page.translationOf._sys.filename;
  if (translationSlug === 'home') {
    translationSlug = '';
  }
}
```

Include in returned props:
```ts
translationProps: translationSlug !== null ? { slug: translationSlug, locale: translationLocale } : null,
```

- [ ] **Step 4: Verify the catch-all page works**

Run: `npm run dev`
Expected: `http://localhost:3000/fr/` loads the French homepage. Pages at `/fr/[slug]` load correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/[[...slug]].tsx
git commit -m "feat(i18n): update catch-all page for locale-aware data fetching"
```

### Task 10: Update post detail page for i18n

**Files:**
- Modify: `src/pages/idee-recue/[slug].tsx`

- [ ] **Step 1: Update getStaticProps to use locale**

Change signature to include `locale`:
```ts
export const getStaticProps = async ({ params, locale }: { params: { slug: string }; locale: string }) => {
```

Update all `relativePath` queries:
- `client.queries.navigation({ relativePath: 'navigation.md' })` → `client.queries.navigation({ relativePath: \`${locale}/navigation.md\` })`
- `client.queries.footerNavigation({ relativePath: 'footer-navigation.md' })` → `client.queries.footerNavigation({ relativePath: \`${locale}/footer-navigation.md\` })`
- `client.queries.post({ relativePath: \`${params.slug}.mdx\` })` → `client.queries.post({ relativePath: \`${locale}/${params.slug}.mdx\` })`

Pass `locale` to props.

- [ ] **Step 2: Update getStaticPaths for all locales**

```ts
export const getStaticPaths = async () => {
  const result = await client.queries.postConnection();

  const paths = result.data.postConnection.edges!.map((edge) => {
    const filePath = edge!.node!._sys.path;
    const pathParts = filePath.split('/');
    const locale = pathParts[pathParts.indexOf('posts') + 1];
    return { params: { slug: edge!.node!._sys.filename }, locale };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
```

- [ ] **Step 3: Filter posts by locale in prev/next navigation**

When fetching `postConnection` for prev/next post links, filter by locale. Posts from `/fr/` folder should only show French prev/next, and `/en/` only English:

After fetching `postsResult`, filter posts to current locale before sorting:
```ts
const allPosts = postsResult.data.postConnection.edges!;
const localePosts = allPosts.filter((edge) => {
  const postPath = edge?.node?._sys.path || '';
  const pathParts = postPath.split('/');
  return pathParts[pathParts.indexOf('posts') + 1] === locale;
});
```

Use `localePosts` instead of `posts` for the prev/next logic and `sortPostsToCategories`.

- [ ] **Step 4: Extract translation data for the language switcher**

Same pattern as Task 9 Step 3 but for posts:
```ts
let translationSlug: string | null = null;
let translationLocale: string | null = null;

if (postResult.data.post.translationOf) {
  const refPath = postResult.data.post.translationOf._sys.path;
  const refParts = refPath.split('/');
  translationLocale = refParts[refParts.indexOf('posts') + 1];
  translationSlug = postResult.data.post.translationOf._sys.filename;
}
```

Include in returned props:
```ts
translationProps: translationSlug !== null
  ? { slug: translationSlug, locale: translationLocale, isPost: true }
  : null,
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/idee-recue/[slug].tsx
git commit -m "feat(i18n): update post detail page for locale-aware data fetching"
```

### Task 11: Update 404 page for i18n

**Files:**
- Modify: `src/pages/404.tsx`

- [ ] **Step 1: Replace static translation import with useTranslations**

Change:
```ts
import t from '@/content/translations';
```
To:
```ts
import useTranslations from '@/hooks/useTranslations';
```

Inside the component, add:
```ts
const t = useTranslations();
```

- [ ] **Step 2: Update getStaticProps for locale**

Change:
```ts
export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: 'footer-navigation.md',
  });
```
To:
```ts
export const getStaticProps = async ({ locale }: { locale: string }) => {
  const navigationResult = await client.queries.navigation({ relativePath: `${locale}/navigation.md` });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: `${locale}/footer-navigation.md`,
  });
```

Note: Next.js may not pass `locale` reliably for 404 pages. If it doesn't, default to `'fr'`:
```ts
const loc = locale || 'fr';
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.tsx
git commit -m "feat(i18n): update 404 page with useTranslations hook"
```

---

## Chunk 4: Update all components to use useTranslations

### Task 12: Update components importing translations

**Files:**
- Modify: `src/components/layout/DarkModeSwitcher.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/MobileNavigation.tsx`
- Modify: `src/components/layout/Metas.tsx`
- Modify: `src/components/layout/PostHeader.tsx`
- Modify: `src/components/content/PostList.tsx`
- Modify: `src/components/content/TextContentMedias.tsx`
- Modify: `src/components/pages/Post.tsx`

For each file, the pattern is the same:

1. Replace `import t from '@/content/translations';` with `import useTranslations from '@/hooks/useTranslations';`
2. Add `const t = useTranslations();` at the top of the component function body
3. All existing references to `t.xxx` continue to work without changes

- [ ] **Step 1: Update DarkModeSwitcher.tsx**

Note: `DarkModeSwitcher` uses `t` at module level for the `options` array. Move the `options` array inside the component so it can use the hook. Replace the module-level `options` constant with a local variable inside the component:

```tsx
export default function DarkModeSwitcher() {
  const t = useTranslations();
  const options: darkModeOption[] = [
    { label: t.darkModeSwitcher.options.light, value: 'light' },
    { label: t.darkModeSwitcher.options.dark, value: 'dark' },
  ];
  // ... rest of component
```

- [ ] **Step 2: Update Header.tsx**

Straightforward replacement. `t` is used only in JSX.

- [ ] **Step 3: Update MobileNavigation.tsx**

Straightforward replacement. `t.mobileNavigation.title` is used in JSX.

- [ ] **Step 4: Update Metas.tsx**

`Metas` is not a hook-friendly component (it's a simple functional component but not using hooks). Since it's already a functional component, adding `useTranslations()` works fine. It needs `useRouter` already available from Next.js.

- [ ] **Step 5: Update PostHeader.tsx**

Straightforward replacement. `t.post` is used in JSX.

- [ ] **Step 6: Update PostList.tsx**

Straightforward replacement. `t.postResults()` is used in JSX.

- [ ] **Step 7: Update TextContentMedias.tsx**

`t.textContentMediaCloseLabel` is used inside a `useEffect`. Move the `useTranslations()` call to the top of the component and reference `t` from there. The `useEffect` dependency array should include `t` (or the specific label values).

- [ ] **Step 8: Update Post.tsx (pages component)**

Straightforward replacement. `t.post` and `t.postReadMore` are used in JSX.

- [ ] **Step 9: Verify build compiles**

Run: `npm run dev`
Expected: No compilation errors. French pages render with correct French strings.

- [ ] **Step 10: Commit**

```bash
git add src/components/layout/DarkModeSwitcher.tsx src/components/layout/Header.tsx src/components/layout/MobileNavigation.tsx src/components/layout/Metas.tsx src/components/layout/PostHeader.tsx src/components/content/PostList.tsx src/components/content/TextContentMedias.tsx src/components/pages/Post.tsx
git commit -m "feat(i18n): update all components to use useTranslations hook"
```

### Task 13: Update PostCard to use locale-aware post routes

**Files:**
- Modify: `src/components/content/PostCard.tsx`

- [ ] **Step 1: Replace postRoute with locale-aware route**

Change:
```ts
import { postRoute } from '@/utils/tina';
```
To:
```ts
import { postRoutes } from '@/utils/tina';
import { useRouter } from 'next/router';
```

Inside the component, add:
```ts
const { locale } = useRouter();
```

Change the href:
```tsx
href={`${postRoute}/${post._sys.filename}`}
```
To:
```tsx
href={`${postRoutes[locale || 'fr']}/${post._sys.filename}`}
```

Note: Next.js i18n automatically prefixes links with the current locale when using `next/link` (which `PageLink` likely wraps). Verify whether `PageLink` uses `next/link` — if so, the locale prefix is automatic and we only need the route segment without the locale prefix.

- [ ] **Step 2: Commit**

```bash
git add src/components/content/PostCard.tsx
git commit -m "feat(i18n): update PostCard to use locale-aware post routes"
```

### Task 14: Update catch-all page post list logic for locale filtering

**Files:**
- Modify: `src/pages/[[...slug]].tsx`

- [ ] **Step 1: Filter posts and categories by locale in getStaticProps**

When the page has a `postList` block, the current code fetches all posts and categories. Update it to filter by locale:

After fetching `postsResult` and `categoryConnectionResult`, filter to current locale:
```ts
const allPosts = postsResult.data.postConnection.edges;
const localePosts = allPosts?.filter((edge) => {
  const postPath = edge?.node?._sys.path || '';
  const pathParts = postPath.split('/');
  return pathParts[pathParts.indexOf('posts') + 1] === locale;
});

const allCategories = categoryConnectionResult.data.categoryConnection.edges;
const localeCategories = allCategories?.filter((edge) => {
  const catPath = edge?.node?._sys.path || '';
  const pathParts = catPath.split('/');
  return pathParts[pathParts.indexOf('categories') + 1] === locale;
});
```

Use `localePosts` and `localeCategories` for the rest of the logic (filter links, sorting, formatPostTitle).

Also update the filter links to not include hardcoded paths — they should use the current page's slug.

- [ ] **Step 2: Commit**

```bash
git add src/pages/[[...slug]].tsx
git commit -m "feat(i18n): filter posts and categories by locale in catch-all page"
```

---

## Chunk 5: Language Switcher component and Layout integration

### Task 15: Create LanguageSwitcherButton component

**Files:**
- Create: `src/components/layout/LanguageSwitcherButton.tsx`

- [ ] **Step 1: Create the component**

Follow the same pattern as `DarkModeSwitcherButton.tsx`:

```tsx
import { MenuItem } from '@headlessui/react';
import classNames from 'classnames';

export default function LanguageSwitcherButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <MenuItem>
      <button
        onClick={onClick}
        className={classNames('navigation-link', {
          'bg-themed-next': active,
        })}
      >
        <span className='flex-grow'>{label}</span>
      </button>
    </MenuItem>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/LanguageSwitcherButton.tsx
git commit -m "feat(i18n): create LanguageSwitcherButton component"
```

### Task 16: Create LanguageSwitcher component

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Create the component**

Follow the `DarkModeSwitcher.tsx` pattern closely:

```tsx
import LanguageSwitcherButton from '@/components/layout/LanguageSwitcherButton';
import Icon from '@/components/ui/Icon';
import useTranslations from '@/hooks/useTranslations';
import { uiStateType } from '@/store/ui-slice';
import { postRoutes } from '@/utils/tina';
import { getMenuMotionVariants } from '@/utils/core';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

type TranslationProps = {
  slug: string;
  locale: string;
  isPost?: boolean;
} | null;

const localeOptions = [
  { label: 'Français', value: 'fr' as const },
  { label: 'English', value: 'en' as const },
];

export default function LanguageSwitcher({
  translationProps,
}: {
  translationProps: TranslationProps;
}) {
  const router = useRouter();
  const t = useTranslations();
  const hiddenTopBar = useSelector((state: uiStateType) => state.ui.hiddenTopBar);
  const currentLocale = router.locale || 'fr';

  const handleChange = (targetLocale: string) => {
    if (targetLocale === currentLocale) return;

    localStorage.setItem('preferred-locale', targetLocale);

    if (translationProps && translationProps.locale === targetLocale) {
      const basePath = translationProps.isPost
        ? `${postRoutes[targetLocale]}/${translationProps.slug}`
        : translationProps.slug
          ? `/${translationProps.slug}`
          : '/';
      router.push(basePath, undefined, { locale: targetLocale });
    } else {
      // Fallback to homepage of target locale
      router.push('/', undefined, { locale: targetLocale });
    }
  };

  return (
    <div
      className={classNames('pointer-events-auto lg:transition-opacity lg:duration-300', {
        'lg:opacity-0 lg:duration-1000': hiddenTopBar,
      })}
    >
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev bg-blurred data-[open]:!border-strong hashover:hover:bg-themed-prev hashover:hover:!border-strong relative z-100 rounded-full border p-16 transition-colors duration-200 ease-out lg:p-20'>
              <span className='text-sm font-bold uppercase lg:text-base'>{currentLocale}</span>
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={getMenuMotionVariants(window?.innerWidth)}
                  anchor='bottom end'
                  className='navigation-menu-items'
                >
                  <div className='navigation-subtitle'>{t.languageSwitcher.title}</div>

                  {localeOptions.map((option) => (
                    <LanguageSwitcherButton
                      key={option.value}
                      label={option.label}
                      onClick={() => handleChange(option.value)}
                      active={currentLocale === option.value}
                    />
                  ))}
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </div>
  );
}
```

Note: Uses the current locale abbreviation (FR/EN) as the button label instead of a globe icon, since the existing `Icon` component doesn't have a globe icon. This keeps it simple and avoids adding new SVG assets.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/LanguageSwitcher.tsx
git commit -m "feat(i18n): create LanguageSwitcher component"
```

### Task 17: Integrate LanguageSwitcher into Layout

**Files:**
- Modify: `src/components/layout/Layout.tsx`
- Modify: `src/pages/_app.tsx`

- [ ] **Step 1: Add LanguageSwitcher to Layout.tsx**

Import the component:
```ts
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
```

Add `translationProps` to the Layout props:
```ts
export default function Layout({
  navigationProps,
  translationProps,
  children,
}: {
  navigationProps: NavigationResult;
  translationProps?: { slug: string; locale: string; isPost?: boolean } | null;
  children: React.ReactNode;
}) {
```

Add `<LanguageSwitcher>` next to `<DarkModeSwitcher>` in the JSX:
```tsx
<div className='grid-item-full lg:grid-item-right flex justify-end gap-12 max-lg:pl-[160px] lg:justify-between'>
  {navigationProps && <Navigation {...navigationProps} />}
  <LanguageSwitcher translationProps={translationProps || null} />
  <DarkModeSwitcher />
  {navigationProps && <MobileNavigation {...navigationProps} />}
</div>
```

- [ ] **Step 2: Pass translationProps through _app.tsx**

In `src/pages/_app.tsx`, the Layout receives `{...pageProps}`. Since `translationProps` is included in `pageProps` from `getStaticProps`, it's automatically passed through. No changes needed in `_app.tsx` unless Layout doesn't receive it.

Verify that `pageProps.translationProps` is available in Layout by checking how `_app.tsx` spreads props:
```tsx
<Layout {...pageProps}>
```
This spreads all pageProps including `translationProps`. Confirm Layout accepts it.

- [ ] **Step 3: Verify the language switcher renders**

Run: `npm run dev`
Expected: The language switcher appears next to the dark mode switcher. It shows "FR" as the active locale.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Layout.tsx
git commit -m "feat(i18n): integrate LanguageSwitcher into Layout"
```

---

## Chunk 6: SEO, Metas, and final verification

### Task 18: Update Metas component for hreflang and canonical

**Files:**
- Modify: `src/components/layout/Metas.tsx`

- [ ] **Step 1: Add hreflang and canonical tags**

Update `Metas.tsx` to accept translation info and current locale, then add hreflang/canonical meta tags:

```tsx
import useTranslations from '@/hooks/useTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
  translationPath?: string;
}

const Metas = ({ title, translationPath }: Props) => {
  const t = useTranslations();
  const { locale, asPath } = useRouter();
  const combinedTitle = t.metaData.title(title);
  const description = t.metaData.description;
  const baseUrl = 'https://avdiji.com';
  const canonicalUrl = `${baseUrl}/${locale}${asPath === '/' ? '' : asPath}`;

  return (
    <Head>
      <title>{combinedTitle}</title>
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:title' content={combinedTitle} />
      <meta property='og:image:url' content='/hazbi-avdiji.jpg' />
      <meta property='og:image:secure_url' content='/hazbi-avdiji.jpg' />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='format-detection' content='telephone=no' />
      <link rel='manifest' href='/manifest.webmanifest' />
      <link rel='canonical' href={canonicalUrl} />
      <link rel='alternate' hrefLang={locale || 'fr'} href={canonicalUrl} />
      {translationPath && (
        <link rel='alternate' hrefLang={locale === 'fr' ? 'en' : 'fr'} href={`${baseUrl}${translationPath}`} />
      )}
    </Head>
  );
};

export default Metas;
```

Note: The `translationPath` prop should be the full path to the translation (e.g., `/en/misconceptions`). It needs to be passed from the page components that have access to `translationProps`.

- [ ] **Step 2: Update Page and Post components to pass translationPath to Metas**

In `src/components/pages/Post.tsx` and the page rendering component, pass the translation path to `<Metas>`. This requires the page components to receive `translationProps` and compute the path.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Metas.tsx src/components/pages/Post.tsx
git commit -m "feat(i18n): add hreflang and canonical meta tags"
```

### Task 19: End-to-end verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds. All French and English pages are generated.

- [ ] **Step 2: Test French pages**

Run: `npm run dev`
- Visit `http://localhost:3000` → should redirect to `/fr/`
- Visit `http://localhost:3000/fr/` → French homepage loads
- Visit `http://localhost:3000/fr/idees-recues` → French post list page loads
- Visit `http://localhost:3000/fr/idee-recue/[any-post]` → French post detail loads

- [ ] **Step 3: Test English pages**

- Visit `http://localhost:3000/en/` → English homepage loads
- Visit `http://localhost:3000/en/misconceptions` → English post list page loads
- Visit `http://localhost:3000/en/misconception/[any-post]` → English post detail loads (via rewrite)

- [ ] **Step 4: Test language switcher**

- On a French page, click the language switcher → select English → navigates to the correct English translation
- On an English page, click the language switcher → select French → navigates to the correct French translation
- On a page without a translation, switching language → navigates to the target locale's homepage

- [ ] **Step 5: Test SEO tags**

- View page source on a French page → verify `<html lang="fr">`, `<link rel="canonical">`, `<link rel="alternate" hrefLang>`
- View page source on an English page → same checks with `en`

- [ ] **Step 6: Run formatter**

Run: `npx prettier --write "src/**/*.{ts,tsx}" "*.{ts,tsx,js,mjs}" "content/**/*.ts" "tina/**/*.ts"`

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat(i18n): format all files"
```

import {
  FooterNavigationQuery,
  NavigationQuery,
  PageQuery,
  PostConnectionQuery,
  PostQuery,
} from '@/tina/types';

export type NavigationResult = {
  data: NavigationQuery;
  variables: object;
  query: string;
};

export type FooteNavigationResult = {
  data: FooterNavigationQuery;
  variables: object;
  query: string;
};

export type PageResult = {
  data: PageQuery;
  variables: object;
  query: string;
};

export type PostsResult = {
  data: PostConnectionQuery;
  variables: object;
  query: string;
};

export type PostResult = {
  data: PostQuery;
  variables: object;
  query: string;
};

export type PostsFilter = {
  label: string;
  link: string;
  category: string;
};

export type ActiveLinkDetectionFn = (currentPathname: string, linkPathname: string) => boolean;

import DarkModeSwitcher from './DarkModeSwitcher';
import Logo from '@/components/layout/Logo';
import PageLink from '@/components/ui/PageLink';

export default function Header() {
  return (
    <header>
      <h2 className='p-gutter lg:fixed lg:left-0 lg:top-0'>
        <PageLink href='/'>
          <Logo className={'w-[120px]'} />
          <span className='sr-only'>Dr. Hazbi Avdiji</span>
          <span className='font-text mt-gutter-1/2 block text-sm leading-title'>
            Diversity
            <br />
            Post-growth
            <br />
            Design
          </span>
        </PageLink>
      </h2>
      <DarkModeSwitcher className='fixed right-gutter top-gutter' />
    </header>
  );
}

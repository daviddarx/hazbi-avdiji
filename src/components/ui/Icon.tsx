import classNames from 'classnames';

export default function Icon({ name, className }: { name: 'close'; className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      className={classNames('h-24 w-24', className)}
    >
      {name === 'close' && (
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M18 6 6 18M6 6l12 12'
        />
      )}
    </svg>
  );
}
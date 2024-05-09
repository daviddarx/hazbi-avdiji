import classNames from 'classnames';

export default function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 36 25'
      className={classNames('h-auto w-36', className)}
    >
      <path
        fill='currentColor'
        d='M20.42 25.01c5.494-2.87 7.052-7.298 7.052-9.84-5.084.246-8.528-3.198-8.446-7.626C19.108 3.28 22.716 0 26.98 0c4.674 0 8.364 4.018 8.364 9.922 0 6.232-4.1 12.956-11.562 15.088H20.42Zm-18.368 0c5.494-2.87 7.052-7.298 7.052-9.84C4.02 15.416.576 11.972.658 7.544.74 3.28 4.348 0 8.612 0c4.674 0 8.364 4.018 8.364 9.922 0 6.232-4.1 12.956-11.562 15.088H2.052Z'
      />
    </svg>
  );
}

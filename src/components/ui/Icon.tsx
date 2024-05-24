import classNames from 'classnames';

export default function Icon({
  name,
  className,
}: {
  name: 'close' | 'light' | 'dark' | 'system' | 'menu';
  className?: string;
}) {
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
      {name === 'light' && (
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0ZM12 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1ZM12 20a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM3.512 3.513a1 1 0 0 1 1.414 0l1.42 1.42a1 1 0 0 1-1.414 1.414l-1.42-1.42a1 1 0 0 1 0-1.414ZM17.652 17.653a1 1 0 0 1 1.415 0l1.42 1.42a1 1 0 0 1-1.415 1.414l-1.42-1.42a1 1 0 0 1 0-1.414ZM0 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1ZM20 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM6.346 17.653a1 1 0 0 1 0 1.414l-1.42 1.42a1 1 0 0 1-1.414-1.414l1.42-1.42a1 1 0 0 1 1.414 0ZM20.486 3.513a1 1 0 0 1 0 1.414l-1.42 1.42a1 1 0 1 1-1.414-1.414l1.42-1.42a1 1 0 0 1 1.415 0Z'
        />
      )}
      {name === 'dark' && (
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M12.082 2.509a1 1 0 0 1-.067 1.085 6 6 0 0 0 8.392 8.392 1 1 0 0 1 1.59.896A10 10 0 1 1 11.119 2.004a1 1 0 0 1 .963.505Zm-2.765 1.93a8 8 0 1 0 10.245 10.245A7.999 7.999 0 0 1 9.317 4.439Z'
        />
      )}
      {name === 'system' && (
        <g fill='currentColor' fillRule='evenodd' clipPath='url(#a)' clipRule='evenodd'>
          <path d='M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z' />
          <path d='M12 2a1 1 0 0 0-1 1v.174a2.65 2.65 0 0 1-1.606 2.425 1 1 0 0 1-.264.073 2.65 2.65 0 0 1-2.73-.607l-.007-.008-.06-.06a1.003 1.003 0 0 0-1.415 0h-.001a1 1 0 0 0 0 1.415l.068.069a2.65 2.65 0 0 1 .542 2.894 2.65 2.65 0 0 1-2.414 1.705H3a1 1 0 0 0 0 2h.174a2.65 2.65 0 0 1 2.423 1.601 2.65 2.65 0 0 1-.532 2.918l-.008.008-.06.06a1.003 1.003 0 0 0-.217 1.09 1 1 0 0 0 .217.325v.001a.999.999 0 0 0 1.415 0l.069-.068a2.65 2.65 0 0 1 2.894-.543 2.65 2.65 0 0 1 1.705 2.415V21a1 1 0 0 0 2 0V20.826a2.65 2.65 0 0 1 1.601-2.423 2.65 2.65 0 0 1 2.918.532l.008.008.06.06a1.002 1.002 0 0 0 1.415 0h.001a1 1 0 0 0 0-1.416l-.068-.068a2.65 2.65 0 0 1-.532-2.918A2.65 2.65 0 0 1 20.906 13H21a1 1 0 0 0 0-2H20.826a2.65 2.65 0 0 1-2.425-1.606.999.999 0 0 1-.073-.264 2.65 2.65 0 0 1 .607-2.73l.008-.007.06-.06a1.002 1.002 0 0 0 0-1.415v-.001a1 1 0 0 0-1.416 0l-.068.068a2.65 2.65 0 0 1-2.918.532A2.65 2.65 0 0 1 13 3.094V3a1 1 0 0 0-1-1ZM9.879.879A3 3 0 0 1 15 3v.087a.65.65 0 0 0 .394.594l.01.004a.65.65 0 0 0 .714-.127l.055-.055a3 3 0 0 1 4.895 3.27c-.151.365-.372.696-.65.974-.001 0 0 0 0 0l-.056.055a.65.65 0 0 0-.127.714c.028.064.05.13.064.2a.65.65 0 0 0 .534.284H21a3 3 0 1 1 0 6h-.087a.65.65 0 0 0-.594.394l-.004.01a.65.65 0 0 0 .127.714l.055.055a3.002 3.002 0 0 1 0 4.245l-.707-.708.707.707a3 3 0 0 1-4.244 0l-.055-.055a.65.65 0 0 0-.714-.127l-.01.004a.649.649 0 0 0-.394.593V21a3 3 0 0 1-6 0v-.076a.65.65 0 0 0-.425-.585.955.955 0 0 1-.059-.024.65.65 0 0 0-.714.127l-.054.055a3.002 3.002 0 1 1-4.245-4.244l.055-.055a.65.65 0 0 0 .127-.714l-.004-.01a.649.649 0 0 0-.594-.394H3a3 3 0 0 1 0-6h.076a.65.65 0 0 0 .585-.425l.024-.059a.65.65 0 0 0-.127-.714l-.055-.054a3 3 0 1 1 4.244-4.245l.055.055a.65.65 0 0 0 .714.127 1 1 0 0 1 .2-.064A.65.65 0 0 0 9 3.167V3A3 3 0 0 1 9.879.879Z' />
        </g>
      )}
      {name === 'menu' && (
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M3 12h14M3 6h18M3 18h18'
        />
      )}
    </svg>
  );
}

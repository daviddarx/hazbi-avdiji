import DarkModeIcon from './DarkModeIcon';
import type { darkModeType } from '@/components/layout/DarkModeSwitcher';
import { MenuItem } from '@headlessui/react';
import classNames from 'classnames';

export default function DarkModeSwitcherButton({
  value,
  label,
  onClick,
  active,
}: {
  value: darkModeType;
  label: string;
  onClick: (value: darkModeType) => void;
  active: boolean;
}) {
  return (
    <MenuItem>
      <button
        onClick={() => {
          onClick(value);
        }}
        className={classNames(
          'border-semi-transparent flex w-full gap-16 !border-b-0 !border-l-0 !border-r-0 px-24 py-16 text-left text-base font-bold transition-colors duration-200 ease-out data-[focus]:bg-theme-prev hashover:hover:bg-theme-prev',
          {
            'bg-theme-next': active,
          },
        )}
      >
        <span className='flex-grow'>{label}</span>
        <DarkModeIcon name={value} />
      </button>
    </MenuItem>
  );
}

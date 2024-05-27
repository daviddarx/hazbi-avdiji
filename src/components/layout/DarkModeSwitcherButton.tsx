import type { darkModeType } from '@/components/layout/DarkModeSwitcher';
import Icon from '@/components/ui/Icon';
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
          'border-light data-[focus]:bg-themed-prev flex w-full gap-16 border-t py-16 pl-24 pr-16 text-left text-base font-bold transition-colors duration-200 ease-out',
          {
            'bg-themed-next': active,
          },
        )}
      >
        <span className='flex-grow'>{label}</span>
        <Icon name={value} />
      </button>
    </MenuItem>
  );
}

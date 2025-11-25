import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';

interface QuantityDropDownProps {
  value?: number;
  maxNum?: number
  onChange?: (evt: ChangeEvent<HTMLInputElement>, quantity: number) => void;
  onBlur?: (evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, number: number) => void;
  onClickNumber?: (evt: MouseEvent<HTMLLIElement>, number: number) => void;
  disabled?: boolean;
  purchaseLimit: number;
}

export default function QuantityDropDown({
  value = 1,
  maxNum = 5,
  onChange = () => { },
  onBlur = () => { },
  onClickNumber = () => { },
  disabled = false,
  purchaseLimit = 10,
}: QuantityDropDownProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);
  const quantities = useMemo(
    () => Array.from({ length: maxNum }, (_, index) => index + 1),
    [maxNum],
  );

  useEffect(() => {
    const updateWidth = () => {
      if (!triggerRef.current) return;
      setMenuWidth(triggerRef.current.offsetWidth);
    };

    updateWidth();
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!triggerRef.current) return;
    setMenuWidth(triggerRef.current.offsetWidth);
  }, [value]);

  const handleSelection = (evt: Event, quantity: number) => {
    if (Number.isNaN(quantity)) return;
    if (quantity === value) return;

    onClickNumber(evt as unknown as MouseEvent<HTMLLIElement>, quantity);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between bg-white"
          ref={triggerRef}
          disabled={disabled}
        >
          <span>{value}</span>
          <VscChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-0 bg-white"
        style={menuWidth ? { width: menuWidth } : undefined}
      >
        {
          quantities.map((quantity) => (
            <DropdownMenuItem
              key={quantity}
              className="cursor-pointer justify-between py-2.5"
              onSelect={(evt) => handleSelection(evt, quantity)}
            >
              {quantity}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

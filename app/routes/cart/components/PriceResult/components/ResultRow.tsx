import type { ReactNode } from 'react';

type ResultRowProps = {
  label: ReactNode;
  value: ReactNode;
}

export default function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center w-full">
      <label className="flex flex-1 justify-start text-xl">
        {label}
      </label>
      <div className="flex-1 flex justify-end text-base font-bold">
        {value}
      </div>
    </div>
  )
}
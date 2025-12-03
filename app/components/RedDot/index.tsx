import type { CSSProperties } from 'react';

interface RedDotProps {
  value: number;
  dotStyle?: CSSProperties;
  indicatorStyle?: CSSProperties;
}

function RedDot({ value, dotStyle = {}, indicatorStyle = {} }: RedDotProps) {
  return (
    <div
      style={dotStyle}
      className="
				font-bold min-w-[1.25rem] min-h-[1.25rem]
				cursor-pointer text-white bg-[red]
				border-2 border-white rounded-xl z-[1]
			"
    >
      <div
        style={indicatorStyle}
        className="
					flex px-[0.375rem]
					items-center justify-center
					text-white font-sans text-[0.7rem]
				"
      >
        {value}
      </div>
    </div>
  );
};

export default RedDot;

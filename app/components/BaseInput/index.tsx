import type { CSSProperties } from 'react';
import InputBase from '@mui/material/InputBase';
import type { InputBaseProps } from '@mui/material/InputBase';

interface BaseInputProps extends InputBaseProps {
  height?: CSSProperties['height'];
}

function BaseInput(props: BaseInputProps) {
  return (
    <div className="
      bg-white rounded-sm border-solid border-[#707070] border-[1px]
      h-10 w-full p-4 relative
      flex items-center shadow-searchbox box-border"
      style={{ height: props.height }}
    >
      <InputBase {...props} />
    </div>
  )
}

export default BaseInput;
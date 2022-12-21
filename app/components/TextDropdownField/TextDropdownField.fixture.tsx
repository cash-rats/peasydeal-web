import TextDropdownField from './index';
import type { Option } from './index';

const options: Option[] = new Array(9).fill(0).map((_, i) => ({
  label: `some address${i}`,
  value: `some address${i}`,
}));

export default (
  <div className="w-full h-screen flex items-center justify-center">
    <TextDropdownField options={options} />
  </div>
);
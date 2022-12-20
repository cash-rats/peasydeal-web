import TextDropdownField from './index';
import type { Option } from './index';

const options: Option[] =
  [
    {
      label: 'some address1',
      value: 'some address1',
    },
    {
      label: 'some address2',
      value: 'some address2',
    },

    {
      label: 'some address3',
      value: 'some address3',
    }
  ];

export default (
  <div className="w-full h-screen flex items-center justify-center">
    <TextDropdownField options={options} />
  </div>
);
import type { SuggestItem } from '~/shared/types';

import DropDownSearchBar from './index';

const results: SuggestItem[] = new Array(6).fill(0).map((_, index) => {
  return {
    title: `someitem_${index}`,
    data: {
      title: 'someitem',
      image: 'https://c1.neweggimages.com/ProductImageCompressAll300/AMCMS220504LEznu.jpg',
      discount: 0.3,
      productID: 'some id',
    }
  }
})

export default (
  <div className="relative w-[1080px] h-screen">
    <div className="w-full absolute top-[10%] left-[15%]">
      <DropDownSearchBar results={results} />
    </div>
  </div>
)
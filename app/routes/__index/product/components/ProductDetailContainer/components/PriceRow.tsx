interface PriceRowParams {
  salePrice: number;
  previousRetailPrice?: Array<number>;
};

function PriceRow({
  salePrice,
  previousRetailPrice = [],
}: PriceRowParams) {
  return (
    <>
      <span className="text-4xl font-poppins font-bold text-[#D02E7D] mr-2">
        £{salePrice}
      </span>
      {
        previousRetailPrice.length > 0 && previousRetailPrice.map((retailPrice, index) => (
          <span
            className='flex relative mr-2'
            key={`previous_retail_price${index}`}
            style={{ fontWeight: index === 0 && previousRetailPrice.length !== 1 ? '500' : '300' }}
          >
            <span className="text-2xl">
              £{retailPrice}
            </span>
            <span className='block w-full h-[3px] absolute top-[50%] bg-black' />
          </span>
        ))
      }
    </>
  )
}

export default PriceRow
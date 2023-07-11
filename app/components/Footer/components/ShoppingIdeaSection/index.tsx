import { Link } from '@remix-run/react';

const shoppingIdea = [
  {
    label: 'Blog',
    link: '/blog',
  }
];


function ShoppingIdeaSection() {
  return (
    <div className="flex flex-col">
      <span className="text-white font-bold text-lg capitalize relative">
        More Shopping Idea
      </span>

      <div className="flex flex-col gap-[10px] mt-[10px]">
        {
          shoppingIdea.map((info, idx) => (
            <Link
              to={info.link}
              key={idx}
            >
              <span
                key={idx}
                className="text-base text-white font-normal capitalize flex items-center"
              >
                <span>{info.label}</span>
                <span className='rounded-lg bg-[#d85140] leading-3 font-white text-[10px] py-[4px] px-[6px] ml-2'>NEW</span>
              </span>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default ShoppingIdeaSection;
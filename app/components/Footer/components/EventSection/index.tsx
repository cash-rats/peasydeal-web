import { Link } from '@remix-run/react';

const companyDetails = [
  {
    label: 'Win a free surprise gift',
    link: '/events/win-a-free-surprise-gift',
  }
];


function EventSection() {
  return (
    <div className="flex flex-col">
      <span className="text-white font-bold text-lg capitalize relative">
        Events
      </span>

      <div className="flex flex-col gap-[10px] mt-[10px]">
        {
          companyDetails.map((info, idx) => (
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

export default EventSection;
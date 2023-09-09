import { Link } from '@remix-run/react';

const links = [
  {
    label: 'sell on peasyDeal',
    link: '/sell-on-peasydeal',
  },
  {
    label: 'contact us',
    link: '/contact-us',
  },
  {
    label: 'about us',
    link: '/about-us',
  },
  {
    label: 'track your order',
    link: '/track',
  },
  {
    label: 'blog',
    link: '/blog',
  },
];


function CompanySection() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[10px] mt-[10px]">
        {
          links.map((info, idx) => (
            <Link
              to={info.link}
              key={idx}
            >
              <span
                key={idx}
                className="text-base text-white font-normal capitalize"
              >
                {info.label}
              </span>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default CompanySection;
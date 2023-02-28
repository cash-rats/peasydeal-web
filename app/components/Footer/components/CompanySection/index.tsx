import { Link } from '@remix-run/react';

const companyDetails = [
  {
    label: 'about us',
    link: '/about-us',
  },
  {
    label: 'privacy policy',
    link: '/privacy',
  },
  {
    label: 'return policy',
    link: '/return-policy',
  },
  {
    label: 'shipping policy',
    link: '/shipping-policy',
  },
  {
    label: 'terms of service',
    link: '/terms-of-use',
  },
  {
    label: 'sell on peasydeal',
    link: '/sell-on-peasydeal',
  },
  {
    label: 'career',
    link: '/',
  }
];


function CompanySection() {
  return (
    <div className="flex flex-col">
      <span className="text-white font-bold text-lg capitalize">
        company
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
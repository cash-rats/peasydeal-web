import { Link } from 'react-router';

const links = [
  {
    label: 'privacy policy',
    link: '/privacy',
  },
  {
    label: 'terms of service',
    link: '/terms-of-use',
  },
  {
    label: 'shipping policy',
    link: '/shipping-policy',
  },
  {
    label: 'return policy',
    link: '/return-policy',
  },
  {
    label: 'payment policy',
    link: '/payment-policy',
  },
];


function OurPolicies() {
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

export default OurPolicies;
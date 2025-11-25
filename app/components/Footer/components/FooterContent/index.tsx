import type { LinksFunction } from 'react-router';
import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { AiOutlineArrowRight } from 'react-icons/ai';

import { Input } from '~/components/ui/input';

import styles from './styles/FooterContent.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

const policies = [
  {
    to: '/privacy',
    title: 'Privacy Policy',
  },
  {
    to: '/cookie-policy',
    title: 'Cookie Policy',
  },
  {
    to: '/return-policy',
    title: 'Return Policy',
  },
  {

    to: '/shipping-policy',
    title: 'Shipping Policy',
  },
  {
    to: '/terms-of-use',
    title: 'Terms of Use',
  },
];

export function PolicyContent() {
  return (
    <div className="text-[#666] md:pb-7">
      {/* <h3 className="content-title"> Policy </h3> */}
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block">
        Policy
      </h3>
      <ul className="list-none pl-0 flex flex-col items-start leading-4 md:leading-8">
        {
          policies.map((policy, index) => (
            <li
              key={index}
              className="py-[10px] cursor-pointer transition-all duration-300 text-base hover:text-[#000]"
            >
              <Link
                // prefetch='render'
                to={policy.to}
              >
                {policy.title}
              </Link>
            </li>
          ))

        }
      </ul>
    </div>
  );
}

export function ContactUsContent() {
  return (
    <div className="text-[#666] md:pb-7">
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block"> Contact Us </h3>
      <p className="font-medium text-base"> contact@peasydeal.com </p>
    </div>
  );
}

export function SubscribeContent() {
  return (
    <div className="text-[#666] md:pb-7">
      <h3 className="mt-0 font-medium pr-8 text-[#000] text-base hidden md:block"> Subscribe </h3>
      <p className="py-2 font-medium text-base">
        Enter your email below to be the first to know about new collections and product launches.
      </p>
      <div className="relative mt-2">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="email"
          name="footer-email"
          placeholder="Enter your email"
          className="w-full border border-border bg-white pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="button"
          aria-label="Submit email"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary p-1 text-white hover:bg-primary/80"
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>

  )

}

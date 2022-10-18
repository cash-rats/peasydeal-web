import type { LinksFunction } from '@remix-run/node';

import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function AboutUs() {
  return (
    <div className="StaticPage-page">
      <h1 className="StaticPage-title">
        About PeasyDeal
      </h1>

      <h2 className="StaticPage-subtitle">
        Mission Statement
      </h2>
      <p className="StaticPage-content">
        At PeasyDeal, we believe that memory is everything. It could be happy, sad, pride... Maybe you don't want to remember those bad in your life, but you can record your happy moments or create more happy moments. Perfect gift helps you create happy moments. Then how about Unique Personalised Gift? It's worth recording precious moments for special people. "Time does not wait for anyone." There’s nothing that says, ‘I was thinking of you’, more than a one-of-a-kind special gift for that one-of-a-kind someone to give a big surprise. Therefore, we aim to help our customers create unique and personalised gifts for all of occasions. We offer a wide array of high-quality, custom gifts for anniversaries, birthdays, holidays, and any other special occasion – big or small.
      </p>

      <h2 className="StaticPage-subtitle">
        What Makes Us Special?
      </h2>
      <p className="StaticPage-content">
        To make your gift special, we must offer personal attention ourselves:

        Products & Designs: We offer a large selection of custom, thoughtful gifts that can be personalised on our website. We’re continually adding new ones on a regular basis, too! <br /><br />

        Customer Care: 24 hours 5 days customer service. Whether you need a recommendation on what the right personalised gift is, or just need help with what to write on the product, we are here for you. Just email and we will be glad to help. <br />

        Quality Guarantee: We guarantee that our products are of the highest quality and craftsmanship, backed by our hassle-free guarantee.<br />

        Ease of Use: Before purchasing a custom gift, you’ll want to know what the finished product looks like. That’s why we provide our customers with an easy-to-use, Online Editor which allows you to personalize and preview your gift in a few simple steps. Just choose your product, pick a design or color, personalize it, preview it, and submit your order. It’s that easy!
      </p>

      <h2 className="StaticPage-subtitle">Contact Us</h2>
      <p className="StaticPage-content">
        If you need a hand with picking that perfect personalised gift, or placing a wholesale order you would like to, just contact us. You can email us at contact@peasydeal.com.  Like our products, the choice is completely yours – we are always happy to help!
      </p>
    </div>
  );
}
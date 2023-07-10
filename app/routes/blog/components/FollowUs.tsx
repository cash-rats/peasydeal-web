import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { SiFacebook } from 'react-icons/si';

const FollowUs = () => {
  return (
    <>
      <h3 className="pb-2 font-poppins border-b-4 border-[#000]">Follow us</h3>
        <div className="flex flex-row ">
          <a
              className="mr-4"
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/peasydeal"
            >
              <AiFillInstagram
                color='#666'
                fontSize={22}
              />
            </a>

            <a
              className="mr-4"
              rel="noreferrer"
              target="_blank"
              href="https://www.twitter.com/peasydeal"
            >
              <AiOutlineTwitter
                color='#666'
                fontSize={22}
              />
            </a>

            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.facebook.com/people/PeasyDeal/100090539543051/"
            >
              <SiFacebook
                color='#666'
                fontSize={22}
              />
            </a>
        </div>
    </>
  );
}

export default FollowUs;

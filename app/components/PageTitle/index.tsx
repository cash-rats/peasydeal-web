import bg from './images/category_bg.jpg';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export default function PageTitle({
  title,
  subtitle,
}: PageTitleProps) {
  return (
    <div
      className={`
        w-full p-2.5 max-w-screen-xl
        mx-auto
        mb-6
        py-[30px] sm:py-[46px]
        px-[18px] px-[26px]
        rounded-xl
      `}
      style={{backgroundImage: `url(${bg})`}}
    >
      <div className='flex flex-col text-white'>
        <h1 className={`
          mb-2 md:mb-3
          text-2xl md:text-3xl
          font-black
          font-poppins
          uppercase
        `}>
          {title}
        </h1>
        {
          subtitle ? <h2 className={`
            text-lg md:text-xl
            font-bold
          `}>{subtitle}</h2> : null
        }
      </div>
    </div>
  )
}
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
        py-[24px] md:py-[46px]
        px-0
        border-t-[1px] border-b-[1px] border-solid border-[#d8d8d8]
      `}
    >
      <div className='flex flex-col text-left md:text-center'>
        <h1 className={`
          text-2xl md:text-3xl
          font-black
          font-poppins
          uppercase
        `}>
          {title}
        </h1>
        {
          subtitle ? <h2 className={`
            mt-2 md:mt-3
            text-lg md:text-xl
            font-bold
          `}>{subtitle}</h2> : null
        }
      </div>
    </div>
  )
}
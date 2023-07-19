import { useState } from 'react'

interface TruncateTextParams {
  text: string;
  className: string;
}

// If text length is less than 300 characters, simply display it
function TruncateText({
  text,
  className,
}: TruncateTextParams) {
  const [showFull, setShowFull] = useState(false);

  const toggleFullText = () => {
    setShowFull(!showFull);
  }

  if (text.length <= 250) {
    return (
      <p className={className}>
        {text}
      </p>
    )
  }

  return (
    <>
      <p className={className}>
        {
          showFull
            ? (text)
            : (
              <>
                {text.slice(0, 250)}...{' '}
              </>
            )
        }
      </p>
      <span
        onClick={toggleFullText}
        className="cursor-pointer text-base text-[rgb(0,179,59)] block capitalize"
      >
        {
          showFull
            ? 'Less'
            : 'More'
        }
      </span>
    </>
  )
}

export default TruncateText
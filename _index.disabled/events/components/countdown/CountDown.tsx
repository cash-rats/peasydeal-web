import type { LinksFunction } from 'react-router';
import { useState, useEffect } from 'react'

import styles from './styles/CountDown.css?url';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
	];
}
function NoStyleCountdownTracker({ label, value }) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    const update = (val: string) => {
      val = ('0' + val).slice(-2);
      if (val !== currentValue) {
        setCurrentValue(val);
      }
    };

    update(value);
  }, [currentValue, value]);

  return (
    <span className="mx-auto flex flex-col justify-center mx-2">
      <b className="text-base text-center">
        <b className="">{ currentValue }</b>
        <b className="" data-value={currentValue > 0 ? currentValue : ''}></b>
        <b className="" data-value={currentValue > 0 ? currentValue : ''}>
          <b className="" data-value={currentValue > 0 ? currentValue : ''}></b>
        </b>
      </b>
      <span className="text-md text-center">{label}</span>
    </span>
  );

}

function CountdownTracker({ label, value }) {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    // const bottom = document.querySelector('.card__bottom');
    // const back = document.querySelector('.card__back');
    // const backBottom = document.querySelector('.card__back .card__bottom');

    const update = (val: string) => {
      val = ('0' + val).slice(-2);
      if (val !== currentValue) {
        if (currentValue >= 0) {
          // back!.setAttribute('data-value', currentValue);
          // bottom!.setAttribute('data-value', currentValue);
        }
        setCurrentValue(val);
        // backBottom!.setAttribute('data-value', val);
        // el.classList.remove('flip');
        // void el.offsetWidth;
        // el.classList.add('flip');
      }
    };

    update(value);
  }, [currentValue, value]);

  return (
    <span className="flip-clock__piece mx-auto">
      <b className="flip-clock__card card text-[40px] md:text-[88px] lg:text-[100px]">
        <b className="card__top">{ currentValue }</b>
        <b className="card__bottom" data-value={currentValue > 0 ? currentValue : ''}></b>
        <b className="card__back" data-value={currentValue > 0 ? currentValue : ''}>
          <b className="card__bottom" data-value={currentValue > 0 ? currentValue : ''}></b>
        </b>
      </b>
      <span className="flip-clock__slot mt-2 text-lg pt-4 text-center text-white">{label}</span>
    </span>
  );
}

function getTimeRemaining(endtime: string) {
  const today = new Date();
  const endDate = new Date(endtime);

  // @ts-ignore eslint-disable-next-line
  const t = endDate - today;

  return {
    Total: t,
    Days: Math.floor(t / (1000 * 60 * 60 * 24)),
    Hours: Math.floor((t / (1000 * 60 * 60)) % 24),
    Min: Math.floor((t / 1000 / 60) % 60),
    Sec: Math.floor((t / 1000) % 60),
  };
}

interface IClock {
  countdown: string;
  onCountdownComplete?: () => void;
  noStyle?: boolean;
}

const Clock = ({ countdown, onCountdownComplete = () => {}, noStyle = false }: IClock) => {
  const [time, setTime] = useState(getTimeRemaining(countdown));

  useEffect(() => {
    let timeInterval: any;

    if (countdown) {
      timeInterval = setInterval(() => {
        const t = getTimeRemaining(countdown);

        setTime(t);

        if (t.Total <= 0) {
          clearInterval(timeInterval);
          onCountdownComplete();
        }
      }, 1000);
    }

    return () => clearInterval(timeInterval);
  }, [countdown, onCountdownComplete]);

  if (noStyle) return (
    <div className='inline-flex gap-2'>
      {Object.entries(time).map(([key, value]) => {
        if (key === 'Total') return null;
        return (<NoStyleCountdownTracker key={key} label={key} value={value} />)
      })}
    </div>
  );

  return (
    <div className="flip-clock flex gap-3 justify-center items-center">
      {Object.entries(time).map(([key, value]) => {
        if (key === 'Total') return null;
        return (<CountdownTracker key={key} label={key} value={value} />)
      })}
    </div>
  );
}

export default Clock;
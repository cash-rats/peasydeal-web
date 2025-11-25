import type { LinksFunction } from 'react-router';

import styles from './styles/CssSpinner.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles }
  ];
}

type Scheme = 'circle' | 'spinner' | 'default';

type CssSpinnerProps = {
  scheme?: Scheme;
}

export default function CssSpinner({ scheme = 'circle' }: CssSpinnerProps) {
  if (scheme === 'spinner') return (
    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )

  if (scheme === 'default') return (
    <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )

  return (
    <div className="lds-circle" >
      <div></div>
    </div>
  )
}

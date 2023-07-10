import { FaCheck } from 'react-icons/fa';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/check.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

function ReviewSuccess() {
  return (
    <div className="relative">
      {/*Review Success*/}
      <div className="center">
        <label className="label">
          <input className="label__checkbox" type="checkbox" />
          <span className="label__text">
            <span className="label__check">
              <FaCheck />
              {/* <i class="fa fa-check icon"></i> */}
            </span>
          </span>
        </label>
      </div>

    </div>
  )
}

export default ReviewSuccess;
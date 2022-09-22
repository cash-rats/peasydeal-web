import type { LinksFunction } from '@remix-run/node';
import ErrorIcon from '@mui/icons-material/Error';

import styles from './styles/Failed.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface FailedProps {
  reason?: string;
  solution?: string;
};

const defaultReason = 'Whoops... looks like problem occurred on your payment';
const defaultSolution = 'Don\'t worry, nothing has been charged. Try checkout again, or contact customer service.';

function Failed({ reason = defaultReason, solution = defaultSolution }: FailedProps) {
  return (
    <div className="payment-failed-container">
      <div className="payment-failed-content">
        <div className="warning-icon">
          <ErrorIcon
            color='warning'
            sx={{ fontSize: 60 }}
          />
        </div>

        <h1 className="title">
          {reason}
        </h1>

        <p className="text">
          {solution}
        </p>
      </div>
    </div>
  );
}

export default Failed;
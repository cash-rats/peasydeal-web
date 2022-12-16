type FiveHundredErrorProps = {
  message?: string;
  statusCode?: number;
}

const FiveHundredError = ({ message, statusCode }: FiveHundredErrorProps) => (
  <div>
    <h1>Internal Server Error</h1>
    <h3>Error message: {message}</h3>
    <code>{statusCode}</code>
  </div>
)

export default FiveHundredError

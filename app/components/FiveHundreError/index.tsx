type FiveHundredErrorProps = {
  error?: Error;
  statusCode?: number;
}

const FiveHundredError = ({ error, statusCode }: FiveHundredErrorProps) => {
  return (
    <div className="bg-[#EB455F] text-[#FCFFE7] p-10">
      <h1 className="text-2xl md:text-3xl">Internal Server Error: We will punish our bad developer, deduct his salary and make him cry</h1>
      <br />
      <h3 className="text-2xl md:text-2xl">Error message: {error?.message}</h3>
      <br />

      <code>{statusCode}</code>
      <code className="mt-10">{error?.stack}</code>
    </div>
  )
}

export default FiveHundredError

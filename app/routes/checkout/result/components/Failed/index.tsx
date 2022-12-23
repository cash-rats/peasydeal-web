import ErrorIcon from '@mui/icons-material/Error';
interface FailedProps {
  reason?: string;
  solution?: string;
};

const defaultReason = 'Whoops... looks like problem occurred on your payment';
const defaultSolution = 'Don\'t worry, nothing has been charged. Try checkout again, or contact customer service.';

function Failed({ reason = defaultReason, solution = defaultSolution }: FailedProps) {
  return (
    <div className="flex min-h-[35rem] bg-white-smoke pt-0 px-[10x] pb-4">
      <div className="max-w-[650px] my-0 mx-auto flex flex-col justify-center items-center">
        <div className="text-center">
          <ErrorIcon
            color='warning'
            sx={{ fontSize: 60 }}
          />
        </div>

        <h1 className="text-center font-semibold text-[1.7rem] mt-1">
          {reason}
        </h1>

        <p className="mt-6 text-center text-base text-[#7f7f7f]">
          {solution}
        </p>
      </div>
    </div>
  );
}

export default Failed;
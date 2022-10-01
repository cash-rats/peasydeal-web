export function ErrorBoundary({ error }) {
  // const caught = useCatch();
  console.log('ErrorBoundary', error);
  return (
    <div className="order-not-found">
      {/* <img
        alt="no data found"
        src={EmptyBox}
      /> */}

      <p> wrong order id maybe? </p>
    </div>
  )
}

export default function TrackOrder() {
  return (
    <div>
      hello tracker
    </div>
  );
}
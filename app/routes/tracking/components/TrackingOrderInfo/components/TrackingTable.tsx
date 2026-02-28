type TrackInfo = {
  trackingNumber: string;
  carrier?: string;
  trackingLink?: string;
}

type TrackingTableProps = {
  trackings: TrackInfo[];
}

function TrackingTable({ trackings }: TrackingTableProps) {
  return (
    <div className="mt-5 w-full overflow-x-auto">
      <table aria-label="shipment tracking table" className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-black py-2.5 text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted">
              Tracking Number
            </th>
            <th className="border-b-2 border-black py-2.5 text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted">
              Carrier
            </th>
            <th className="border-b-2 border-black py-2.5 text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((row) => (
            <tr key={`${row.carrier ?? ''}-${row.trackingNumber}`}>
              <td className="break-all border-b border-[#F0F0F0] py-3 font-body text-sm text-black">
                {row.trackingNumber}
              </td>
              <td className="border-b border-[#F0F0F0] py-3 font-body text-sm text-black">
                {row.carrier || '—'}
              </td>
              <td className="break-all border-b border-[#F0F0F0] py-3 font-body text-sm text-black">
                {row.trackingLink ? (
                  <a
                    href={row.trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {row.trackingLink}
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrackingTable;

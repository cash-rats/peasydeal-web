import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

type TrackInfo = {
  trackingNumber: string;
  carrier: string;
  trackingLink: string;
}

type TrackingTableProps = {
  trackings: TrackInfo[];
}

function TrackingTable({ trackings }: TrackingTableProps) {
  return (
    <div className="font-poppins w-full">
      <h1 className="font-medium mb-2">
        Shipment trackings:
      </h1>
      <Table aria-label="shipment tracking table">
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Tracking Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trackings.map((row) => (
            <TableRow key={row.trackingNumber}>
              <TableCell className="font-semibold">{row.trackingNumber}</TableCell>
              <TableCell>{row.carrier}</TableCell>
              <TableCell className="break-all text-muted-foreground">{row.trackingLink}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TrackingTable

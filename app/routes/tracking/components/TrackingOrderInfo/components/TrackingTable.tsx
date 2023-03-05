import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="shippment tracking table">
          <TableHead>
            <TableRow>
              <TableCell>Tracking Number</TableCell>
              <TableCell align="left">Carrier</TableCell>
              <TableCell align="left">Tracking Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackings.map((row, index) => (
              <TableRow
                key={row.trackingNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.trackingNumber}
                </TableCell>
                <TableCell align="left">{row.carrier}</TableCell>
                <TableCell align="left">{row.trackingLink}</TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TrackingTable
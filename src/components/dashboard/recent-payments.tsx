import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { RouterOutputs } from "@/server"
import { CustomBadge } from "../CustomBadge"
import { PAYMENT_STATUS } from "@/constants/index"

interface RecentPaymentsProps {
  payments: RouterOutputs["payment"]["getAll"]
}



export function RecentPayments({payments}:RecentPaymentsProps) {
  return (
    <>
      <Table>
        <TableCaption>A list of your recent Wihtdrawls  .</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] ">Transaction id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium w-[100px] truncate">{payment.txid}</TableCell>
              <TableCell>
              <CustomBadge badgeValue={payment.status} status={PAYMENT_STATUS} />
              </TableCell>
              <TableCell>{payment.type}</TableCell>
              <TableCell className="text-right">{formatPrice(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{formatPrice(2500.00)}</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </>
  )
}

import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface WalletBalanceProps {
  balance: number
}

export const WalletBalance: FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <Link href="/wallet">
      <div className="flex gap-2 items-center justify-center rounded-md duration-150 cursor-pointer hover:bg-gray-200 text-slate-700 p-2">
        <Wallet size={19} />
        {formatPrice(balance)}
      </div>
    </Link>
  );
};



import { useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransactionTypeCode, TransactionStatus } from "@/lib/data/types";
import { TRANSACTION_TYPE_CODES, TRANSACTION_STATUSES } from "@/lib/data/types";

const TYPE_LABELS: Record<TransactionTypeCode, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer_in: "Transfer In",
  transfer_out: "Transfer Out",
  wire_in: "Wire In",
  wire_out: "Wire Out",
  fee: "Fee",
  interest: "Interest",
  adjustment: "Adjustment",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  posted: "Posted",
  pending: "Pending",
  failed: "Failed",
  reversed: "Reversed",
};

interface TransactionFiltersProps {
  readonly onTypeChange: (type: TransactionTypeCode | undefined) => void;
  readonly onStatusChange: (status: TransactionStatus | undefined) => void;
  readonly currentType: TransactionTypeCode | undefined;
  readonly currentStatus: TransactionStatus | undefined;
}

export function TransactionFilters({
  onTypeChange,
  onStatusChange,
  currentType,
  currentStatus,
}: TransactionFiltersProps): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={currentType ?? "all"}
        onValueChange={(val) => onTypeChange(val === "all" ? undefined : (val as TransactionTypeCode))}
      >
        <SelectTrigger className="w-[160px] border-white/[0.06] bg-white/[0.02]">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent className="border-white/[0.06] bg-popover/90 backdrop-blur-xl">
          <SelectItem value="all">All types</SelectItem>
          {TRANSACTION_TYPE_CODES.map((type) => (
            <SelectItem key={type} value={type}>
              {TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentStatus ?? "all"}
        onValueChange={(val) => onStatusChange(val === "all" ? undefined : (val as TransactionStatus))}
      >
        <SelectTrigger className="w-[160px] border-white/[0.06] bg-white/[0.02]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent className="border-white/[0.06] bg-popover/90 backdrop-blur-xl">
          <SelectItem value="all">All statuses</SelectItem>
          {TRANSACTION_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Hook to sync transaction filters with URL search params.
 * Filter state survives page reloads and is shareable via URL.
 */
export function useTransactionFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = (searchParams.get("type") as TransactionTypeCode | null) ?? undefined;
  const status = (searchParams.get("status") as TransactionStatus | null) ?? undefined;
  const page = Number(searchParams.get("page")) || 1;

  const setType = (newType: TransactionTypeCode | undefined): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newType) {
        next.set("type", newType);
      } else {
        next.delete("type");
      }
      next.delete("page"); // reset to page 1 on filter change
      return next;
    });
  };

  const setStatus = (newStatus: TransactionStatus | undefined): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStatus) {
        next.set("status", newStatus);
      } else {
        next.delete("status");
      }
      next.delete("page");
      return next;
    });
  };

  const setPage = (newPage: number): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage > 1) {
        next.set("page", String(newPage));
      } else {
        next.delete("page");
      }
      return next;
    });
  };

  return { type, status, page, setType, setStatus, setPage };
}

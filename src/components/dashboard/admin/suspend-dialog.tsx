/**
 * Suspend user confirmation dialog.
 * Requires a reason before confirming suspension.
 */
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SuspendDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly username: string;
  readonly isPending: boolean;
  readonly onConfirm: (reason: string) => void;
}

export function SuspendDialog({
  open,
  onOpenChange,
  username,
  isPending,
  onConfirm,
}: SuspendDialogProps): React.ReactElement {
  const [reason, setReason] = useState("");

  const handleConfirm = (): void => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-white/[0.06] bg-popover/95 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend {username}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent the user from accessing their accounts and performing
            any transactions. You can unsuspend them later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="suspend-reason">Reason for suspension</Label>
          <Textarea
            id="suspend-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Suspicious transaction activity"
            className="border-white/[0.06] bg-white/[0.02]"
            rows={3}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/[0.06]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Suspending..." : "Suspend User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

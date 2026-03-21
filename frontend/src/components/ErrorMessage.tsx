import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
    <AlertCircle className="h-5 w-5 shrink-0" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

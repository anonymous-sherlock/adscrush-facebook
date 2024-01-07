import { cn } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
  classname?: string
};

export const FormSuccess = ({
  message,
  classname
}: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className={cn("bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-base text-emerald-600 w-full", classname)}>
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

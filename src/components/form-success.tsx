import { cn } from "@/lib/utils";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { useState } from "react";

interface FormSuccessProps {
  message?: string;
  classname?: string;
  isCollapsible?: boolean;
}

export const FormSuccess = ({ message, classname, isCollapsible }: FormSuccessProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };
  if (!message || !isVisible) return null;

  return (
    <div
      className={cn("relative transition-opacity duration-300 ease-in-out bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-base text-emerald-600 w-full", classname)}
    >
      <CheckCircledIcon className="h-4 w-4" />
      <p className="capitalize">{message}</p>

      {isCollapsible ? (
        <span className="absolute cursor-pointer bg-emerald-500/50 border border-emerald-700 text-white rounded-full -top-2 -right-1 z-50" onClick={handleClose}>
          <X className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
};

import { Onboarding_Status, Payment_Status } from "@prisma/client";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { CircleIcon } from "lucide-react";

export const DOCUMENT_OPTIONS: string[] = [
  "Voter ID",
  "Passport",
  "Driver's License",
  "PAN Card",
  "Ration Card",
  "Student ID",
  "Employee ID",
  "Social Security Card",
  "Health Insurance Card",
];

export const maxUploadFileSize = 8 * 1024 * 1024; // Assuming max size is 8MB


export type StatusType = {
  label: string;
  value: Onboarding_Status | Payment_Status
  icon?: React.ComponentType<{ className?: string }>;
  color?: {
    textColor: string;
    bgColor: string;
    ringColor: string;
  };
};


export type OnboardingStatusProps = StatusType & {
  value: Onboarding_Status;
};

export const ONBOARDING_STATUS: OnboardingStatusProps[] = [
  {
    label: "On Hold",
    value: "Hold",
    icon: CircleIcon,
    color: {
      textColor: "text-yellow-700",
      bgColor: "!bg-yellow-50",
      ringColor: "ring-yellow-600/20",
    },
  },

  {
    value: "Verified",
    label: "Verified",
    icon: CheckCircledIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "Declined",
    label: "Declined",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];


export type PaymentStatusProps = StatusType & {
  value: Payment_Status;
}
export const PAYMENT_STATUS: PaymentStatusProps[] = [
  {
    label: "Pending",
    value: "PENDING",
    icon: CircleIcon,
    color: {
      textColor: "text-yellow-700",
      bgColor: "!bg-yellow-50",
      ringColor: "ring-yellow-600/20",
    },
  },

  {
    value: "PAID",
    label: "Paid",
    icon: CheckCircledIcon,
    color: {
      textColor: "text-green-700",
      bgColor: "!bg-green-50",
      ringColor: "ring-green-600/20",
    },
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: CrossCircledIcon,
    color: {
      textColor: "text-red-700",
      bgColor: "!bg-red-50",
      ringColor: "ring-red-600/20",
    },
  },
];
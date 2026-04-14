// components/form/FormField.tsx
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  isRequired?: boolean | undefined;
  error?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
};

export const FormField = ({
  label,
  isRequired,
  error,
  className,
  children,
}: Props) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("inline-flex items-center", error && "text-red-500")}>
        {label}
        {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
      </Label>

      {children}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

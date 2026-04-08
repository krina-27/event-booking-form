// components/form/FormField.tsx
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export const FormField = ({ label, error, children }: Props) => {
  return (
    <div className="space-y-2">
      <Label className={cn(error && "text-red-500")}>{label}</Label>

      {children}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

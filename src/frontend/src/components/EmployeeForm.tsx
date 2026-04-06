import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  Fingerprint,
  Hash,
  Loader2,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { EmployeeRecord } from "../backend.d";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EmployeeRecord, "id" | "timestamp">) => Promise<void>;
  initial?: EmployeeRecord | null;
  isLoading?: boolean;
}

const emptyForm = {
  name: "",
  employeeId: "",
  aadhaarNumber: "",
  uanNumber: "",
  bankAccountNumber: "",
  ifscCode: "",
  mobileNumber: "",
};

export function EmployeeForm({
  open,
  onClose,
  onSubmit,
  initial,
  isLoading,
}: EmployeeFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [nameError, setNameError] = useState("");

  // Reset form when dialog opens or initial data changes
  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          employeeId: initial.employeeId || "",
          aadhaarNumber: initial.aadhaarNumber || "",
          uanNumber: initial.uanNumber || "",
          bankAccountNumber: initial.bankAccountNumber || "",
          ifscCode: initial.ifscCode || "",
          mobileNumber: initial.mobileNumber || "",
        });
      } else {
        setForm(emptyForm);
      }
      setNameError("");
    }
  }, [open, initial]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === "name" && nameError) setNameError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError("Employee name is required");
      return;
    }
    const data: Omit<EmployeeRecord, "id" | "timestamp"> = {
      name: form.name.trim(),
      ...(form.employeeId.trim() ? { employeeId: form.employeeId.trim() } : {}),
      ...(form.aadhaarNumber.trim()
        ? { aadhaarNumber: form.aadhaarNumber.trim() }
        : {}),
      ...(form.uanNumber.trim() ? { uanNumber: form.uanNumber.trim() } : {}),
      ...(form.bankAccountNumber.trim()
        ? { bankAccountNumber: form.bankAccountNumber.trim() }
        : {}),
      ...(form.ifscCode.trim()
        ? { ifscCode: form.ifscCode.trim().toUpperCase() }
        : {}),
      ...(form.mobileNumber.trim()
        ? { mobileNumber: form.mobileNumber.trim() }
        : {}),
    };
    await onSubmit(data);
    setForm(emptyForm);
    setNameError("");
  };

  const handleClose = () => {
    setForm(emptyForm);
    setNameError("");
    onClose();
  };

  const fields = [
    {
      id: "employeeId",
      label: "Employee ID",
      placeholder: "e.g. EMP001",
      icon: <BadgeCheck className="w-4 h-4" />,
    },
    {
      id: "aadhaarNumber",
      label: "Aadhaar Number",
      placeholder: "12-digit Aadhaar number",
      icon: <Fingerprint className="w-4 h-4" />,
    },
    {
      id: "uanNumber",
      label: "UAN Number",
      placeholder: "12-digit UAN number",
      icon: <Hash className="w-4 h-4" />,
    },
    {
      id: "bankAccountNumber",
      label: "Bank Account Number",
      placeholder: "Bank account number",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: "ifscCode",
      label: "IFSC Code",
      placeholder: "e.g. SBIN0001234",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: "mobileNumber",
      label: "Mobile Number",
      placeholder: "10-digit mobile number",
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="max-w-md w-full max-h-[90vh] overflow-y-auto"
        data-ocid="employee_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emp-text">
            {initial ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Employee Name - Required */}
          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-emp-text flex items-center gap-1"
            >
              <User className="w-4 h-4 text-emp-blue" />
              Employee Name <span className="text-emp-red">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Full name of employee"
              className={nameError ? "border-emp-red" : ""}
              data-ocid="employee_form.input"
              autoFocus
            />
            {nameError && (
              <p
                className="text-xs text-emp-red mt-1"
                data-ocid="employee_form.error_state"
              >
                {nameError}
              </p>
            )}
          </div>

          {/* Optional fields */}
          {fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <Label
                htmlFor={field.id}
                className="text-sm font-medium text-emp-text2 flex items-center gap-1"
              >
                <span className="text-emp-blue">{field.icon}</span>
                {field.label}
                <span className="text-emp-muted text-xs ml-1">(optional)</span>
              </Label>
              <Input
                id={field.id}
                value={form[field.id as keyof typeof form]}
                onChange={handleChange(field.id)}
                placeholder={field.placeholder}
                data-ocid={`employee_form.${field.id}.input`}
              />
            </div>
          ))}

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-ocid="employee_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emp-blue hover:bg-blue-700 text-white"
              data-ocid="employee_form.submit_button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : initial ? (
                "Update Employee"
              ) : (
                "Add Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

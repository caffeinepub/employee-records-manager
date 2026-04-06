import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Eye, EyeOff, ImageDown, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { EmployeeRecord } from "../backend.d";

interface EmployeeCardProps {
  employee: EmployeeRecord;
  index: number;
  selected: boolean;
  onSelect: (id: bigint, checked: boolean) => void;
  onEdit: (employee: EmployeeRecord) => void;
  onDelete: (id: bigint) => void;
  onShare: (employee: EmployeeRecord) => void;
  onShareImage: (employee: EmployeeRecord) => void;
}

const AVATAR_COLORS = [
  "#1E88E5",
  "#8B5CF6",
  "#059669",
  "#F59E0B",
  "#EC4899",
  "#EF4444",
  "#0EA5E9",
  "#14B8A6",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function maskValue(value: string, showChars = 4): string {
  if (value.length <= showChars) return "\u25cf".repeat(value.length);
  return "\u25cf".repeat(value.length - showChars) + value.slice(-showChars);
}

export function EmployeeCard({
  employee,
  index,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onShare,
  onShareImage,
}: EmployeeCardProps) {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showBank, setShowBank] = useState(false);

  const avatarColor = getAvatarColor(employee.name);
  const initials = getInitials(employee.name);

  return (
    <div
      className={`emp-card flex flex-col h-full ${selected ? "selected" : ""}`}
      data-ocid={`employees.item.${index}`}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onSelect(employee.id, !!checked)}
              data-ocid={`employees.checkbox.${index}`}
              className="border-2"
            />
          </div>

          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-sm"
            style={{ background: avatarColor }}
          >
            {initials}
          </div>

          {/* Name & ID */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-[18px] font-bold text-emp-text leading-tight truncate"
              title={employee.name}
            >
              {employee.name}
            </h3>
            {employee.employeeId && (
              <p className="text-sm text-emp-text2 mt-0.5 font-medium">
                ID: {employee.employeeId}
              </p>
            )}
          </div>

          {/* Share button */}
          <button
            type="button"
            onClick={() => onShare(employee)}
            className="p-1.5 rounded-lg text-emp-muted hover:text-emp-blue hover:bg-accent transition-colors"
            title="Share employee info"
            data-ocid={`employees.share_button.${index}`}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-emp-border mx-4" />

      {/* Details */}
      <div className="px-4 py-3 flex-1 space-y-2">
        {/* Aadhaar */}
        {employee.aadhaarNumber && (
          <div className="field-row">
            <span className="field-label">Aadhaar</span>
            <div className="flex items-center gap-1.5">
              <span className="field-value font-mono text-xs">
                {showAadhaar
                  ? employee.aadhaarNumber
                  : maskValue(employee.aadhaarNumber, 4)}
              </span>
              <button
                type="button"
                onClick={() => setShowAadhaar((v) => !v)}
                className="text-emp-muted hover:text-emp-blue transition-colors"
                title={showAadhaar ? "Hide" : "Show"}
              >
                {showAadhaar ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* UAN */}
        {employee.uanNumber && (
          <div className="field-row">
            <span className="field-label">UAN</span>
            <span className="field-value font-mono text-xs">
              {employee.uanNumber}
            </span>
          </div>
        )}

        {/* Bank Account */}
        {employee.bankAccountNumber && (
          <div className="field-row">
            <span className="field-label">Bank Account</span>
            <div className="flex items-center gap-1.5">
              <span className="field-value font-mono text-xs">
                {showBank
                  ? employee.bankAccountNumber
                  : maskValue(employee.bankAccountNumber, 4)}
              </span>
              <button
                type="button"
                onClick={() => setShowBank((v) => !v)}
                className="text-emp-muted hover:text-emp-blue transition-colors"
                title={showBank ? "Hide" : "Show"}
              >
                {showBank ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* IFSC */}
        {employee.ifscCode && (
          <div className="field-row">
            <span className="field-label">IFSC</span>
            <span className="field-value font-mono text-xs uppercase">
              {employee.ifscCode}
            </span>
          </div>
        )}

        {/* Mobile */}
        {employee.mobileNumber && (
          <div className="field-row">
            <span className="field-label">Mobile</span>
            <span className="field-value">{employee.mobileNumber}</span>
          </div>
        )}

        {/* No data fallback */}
        {!employee.aadhaarNumber &&
          !employee.uanNumber &&
          !employee.bankAccountNumber &&
          !employee.ifscCode &&
          !employee.mobileNumber && (
            <p className="text-emp-muted text-sm py-2 text-center italic">
              No additional details
            </p>
          )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-3 flex gap-2 border-t border-emp-border">
        <Button
          onClick={() => onEdit(employee)}
          className="flex-1 bg-emp-blue hover:bg-blue-700 text-white h-9 text-sm font-semibold"
          data-ocid={`employees.edit_button.${index}`}
        >
          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(employee.id)}
          className="flex-1 bg-emp-red hover:bg-red-800 text-white h-9 text-sm font-semibold"
          data-ocid={`employees.delete_button.${index}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Delete
        </Button>
        <Button
          onClick={() => onShareImage(employee)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm font-semibold"
          data-ocid={`employees.share_image_button.${index}`}
          title="Share as image"
        >
          <ImageDown className="w-3.5 h-3.5 mr-1.5" />
          Image
        </Button>
      </div>
    </div>
  );
}

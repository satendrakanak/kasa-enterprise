"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { userClientService } from "@/services/users/user.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditableFieldProps {
  userId: number;
  label: string;
  value: string;
  field: string;
  onUpdated: (val: string) => void;
  editable?: boolean;
}

export function EditableField({
  userId,
  label,
  value,
  field,
  onUpdated,
  editable = true,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isEditable = editable !== false;
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // optional (select text)
    }
  }, [isEditing]);
  const handleSave = async () => {
    try {
      setLoading(true);

      await userClientService.updateUser({
        [field]: temp,
      });

      onUpdated(temp);
      toast.success("Updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b gap-x-2">
      {/* LEFT */}
      <div className="flex flex-col w-full ">
        <span className="text-xs text-gray-400">{label}</span>

        {!isEditable ? (
          <span className="text-sm font-medium text-gray-800">
            {value || "—"}
          </span>
        ) : !isEditing ? (
          <span className="text-sm font-medium text-gray-800">
            {value || "—"}
          </span>
        ) : (
          <div className="relative mt-1">
            <input
              ref={inputRef}
              value={temp}
              id={field}
              disabled={loading}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setTemp(value);
                  setIsEditing(false);
                }
              }}
              className="w-full text-sm px-2 py-1 border-b border-primary outline-none bg-transparent disabled:opacity-50"
            />

            {/* 🔥 Loading overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-white/60 dark:bg-slate-950/50">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center mt-4 gap-2">
        {/* 🔒 NOT EDITABLE */}
        {!isEditable && <span className="p-1 rounded-md bg-gray-100">🔒</span>}

        {/* ✏️ EDIT MODE OFF */}
        {isEditable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <Pencil size={12} className="text-gray-500" />
          </button>
        )}

        {/* ✅ EDIT MODE ON */}
        {isEditable && isEditing && (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-1 rounded-md hover:bg-green-100 cursor-pointer"
            >
              <Check size={14} className="text-green-600" />
            </button>

            <button
              onClick={() => {
                setTemp(value);
                setIsEditing(false);
              }}
              className="p-1 rounded-md hover:bg-red-100 cursor-pointer"
            >
              <X size={14} className="text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

/**
 * Aceternity "File Upload", reworked for this project.
 *
 * Changes from the upstream copy: retokenised onto the design system (the sky-400 dashed
 * outline was a second accent colour), the label and hint are props, a rejected file
 * produces a real inline error, and an accepted file can be removed again.
 *
 * Motion justification: the card lifts on hover and settles when a file lands. That is
 * drop-target affordance and completion feedback, not decoration.
 */

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconFileCheck, IconTrash, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const liftVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 12, y: -12, opacity: 0.95 },
};

const outlineVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const MAX_BYTES = 10 * 1024 * 1024;

export const FileUpload = ({
  id = "file-upload-handle",
  label = "Upload your passport bio page",
  hint = "Drag and drop, or click to browse. PDF, JPG or PNG up to 10 MB.",
  accept = { "application/pdf": [".pdf"], "image/*": [".jpg", ".jpeg", ".png"] },
  onChange,
  className,
}: {
  id?: string;
  label?: string;
  hint?: string;
  accept?: Record<string, string[]>;
  onChange?: (files: File[]) => void;
  className?: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const accepted = (files: File[]) => {
    const next = files[0];
    if (!next) return;
    if (next.size > MAX_BYTES) {
      setError("That file is over 10 MB. Compress it or upload a photo of the page.");
      return;
    }
    setError(null);
    setFile(next);
    onChange?.([next]);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept,
    maxSize: MAX_BYTES,
    onDrop: accepted,
    onDropRejected: () =>
      setError("We could not read that file. Use a PDF, JPG or PNG under 10 MB."),
  });

  return (
    <div className={cn("w-full", className)} {...getRootProps()}>
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        whileHover={reduce ? undefined : "animate"}
        className={cn(
          "group/file relative block w-full cursor-pointer overflow-hidden rounded-xl border border-dashed p-8 transition-colors",
          isDragActive ? "border-brand-strong bg-brand-tint/60" : "border-line bg-ground",
          error && "border-destructive",
        )}
      >
        <input
          ref={fileInputRef}
          id={id}
          name="documents"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          aria-describedby={`${id}-hint`}
          onChange={(event) => accepted(Array.from(event.target.files || []))}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <p className="relative z-20 text-base font-semibold text-ink">{label}</p>
          <p id={`${id}-hint`} className="relative z-20 mt-1.5 max-w-sm text-sm text-ink-soft">
            {hint}
          </p>

          <div className="relative mx-auto mt-8 w-full max-w-md">
            {file ? (
              <motion.div
                layoutId="file-upload"
                className="relative z-40 mx-auto flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left"
              >
                <IconFileCheck size={22} stroke={1.75} className="shrink-0 text-positive" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                  <p className="numeric mt-0.5 text-xs text-ink-soft">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-brand-tint hover:text-ink"
                >
                  <IconTrash size={16} stroke={1.75} />
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layoutId="file-upload"
                  variants={reduce ? undefined : liftVariant}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="relative z-40 mx-auto grid h-24 w-28 place-items-center rounded-xl border border-line bg-surface shadow-[0_18px_40px_-28px_rgba(22,16,10,0.45)]"
                >
                  {isDragActive ? (
                    <span className="flex flex-col items-center gap-1 text-sm text-brand-strong">
                      Drop it
                      <IconUpload size={16} stroke={1.75} />
                    </span>
                  ) : (
                    <IconUpload size={18} stroke={1.75} className="text-ink-soft" />
                  )}
                </motion.div>

                <motion.div
                  variants={reduce ? undefined : outlineVariant}
                  className="absolute inset-0 z-30 mx-auto grid h-24 w-28 place-items-center rounded-xl border border-dashed border-brand opacity-0"
                />
              </>
            )}
          </div>
        </div>
      </motion.div>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
};

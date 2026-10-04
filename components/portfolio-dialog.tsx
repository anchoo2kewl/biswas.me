"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

/** Native modal semantics: focus containment, Escape, and return to the opener. */
export function PortfolioDialog({ open, onClose, title, eyebrow, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="p-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      {open && <>
        <div className="p-dialog-heading">
          <div>{eyebrow && <p className="p-eyebrow">{eyebrow}</p>}<h2 id={titleId}>{title}</h2></div>
          <button className="p-dialog-close" type="button" onClick={onClose} aria-label="Close details"><span aria-hidden="true">×</span></button>
        </div>
        <div className="p-dialog-body">{children}</div>
      </>}
    </dialog>
  );
}

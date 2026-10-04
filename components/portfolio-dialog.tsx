"use client";

import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/** Native modal semantics, explicit Tab wrapping, Escape, and return to the opener. */
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
    dialog.querySelector<HTMLButtonElement>(".p-dialog-close")?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    // Recompute for each key press: adjacent chapters may disable or add controls.
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0 && !element.closest('[hidden], [inert]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); dialog.focus(); return; }
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || active === dialog || !dialog.contains(active))) {
      event.preventDefault(); first.focus();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="p-dialog"
      aria-labelledby={titleId}
      onKeyDown={keepFocusInside}
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

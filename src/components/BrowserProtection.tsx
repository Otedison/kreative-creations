"use client";

import { useEffect } from "react";

/**
 * A light production-only deterrent for casual browser inspection.
 * This is not a security boundary: client-side code remains inspectable.
 */
export default function BrowserProtection() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const preventContextMenu = (event: MouseEvent) => event.preventDefault();
    const preventInspectionShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isInspectionShortcut =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && key === "u");

      if (isInspectionShortcut) event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventInspectionShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventInspectionShortcuts);
    };
  }, []);

  return null;
}

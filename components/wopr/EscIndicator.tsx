"use client";

import styles from "./wopr.module.css";

export function EscIndicator() {
  return <span className={styles.escIndicator} aria-hidden="true">[ ESC ]</span>;
}

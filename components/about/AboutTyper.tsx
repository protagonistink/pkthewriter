"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  text: string;
  speed: number;
  instant: boolean;
  onDone?: () => void;
};

export function AboutTyper({ text, speed, instant, onDone }: Props) {
  const prefersReduced = useReducedMotion();
  const shouldBeInstant = instant || !!prefersReduced;
  const [displayed, setDisplayed] = useState(shouldBeInstant ? text : "");
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    if (shouldBeInstant) {
      setDisplayed(text);
      doneRef.current = true;
      onDone?.();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        doneRef.current = true;
        onDone?.();
      }
    }, speed);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, shouldBeInstant]);

  return <>{displayed}</>;
}

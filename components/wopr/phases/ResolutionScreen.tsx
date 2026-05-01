"use client";

import { useEffect, useState } from "react";
import styles from "../wopr.module.css";

const PRE_DOTS = ["...", "...", "..."];
const LINE_TEXT = "A STRANGE GAME.\nTHE ONLY WINNING MOVE IS NOT TO PLAY.";
const CHESS_TEXT = "HOW ABOUT A NICE GAME OF GIFT DECIDER?";

export function ResolutionScreen({
  onClick,
  onDismiss,
  reduceMotion,
}: {
  onClick: () => void;
  onDismiss: () => void;
  reduceMotion: boolean;
}) {
  const [stage, setStage] = useState<
    "dots" | "line" | "chess" | "ready"
  >(reduceMotion ? "line" : "dots");
  const [dotIndex, setDotIndex] = useState(0);
  const [linePos, setLinePos] = useState(0);
  const [chessPos, setChessPos] = useState(0);

  useEffect(() => {
    if (stage !== "dots" || reduceMotion) return;
    if (dotIndex >= PRE_DOTS.length) {
      setStage("line");
      return;
    }
    onClick();
    const t = window.setTimeout(() => setDotIndex(dotIndex + 1), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, dotIndex, reduceMotion]);

  useEffect(() => {
    if (stage !== "line") return;
    if (linePos >= LINE_TEXT.length) {
      const t = window.setTimeout(() => setStage("chess"), 1400);
      return () => clearTimeout(t);
    }
    if (LINE_TEXT[linePos] !== "\n" && LINE_TEXT[linePos] !== " ") onClick();
    const delay = reduceMotion ? 0 : 60;
    const t = window.setTimeout(() => setLinePos(linePos + 1), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, linePos, reduceMotion]);

  useEffect(() => {
    if (stage !== "chess") return;
    if (chessPos >= CHESS_TEXT.length) {
      const t = window.setTimeout(() => setStage("ready"), 900);
      return () => clearTimeout(t);
    }
    if (CHESS_TEXT[chessPos] !== " ") onClick();
    const t = window.setTimeout(() => setChessPos(chessPos + 1), reduceMotion ? 0 : 38);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, chessPos, reduceMotion]);

  useEffect(() => {
    if (stage !== "ready") return;
    const handler = () => onDismiss();
    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);
    };
  }, [stage, onDismiss]);

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalText}>
        {stage === "dots" && !reduceMotion && (
          <div>
            {PRE_DOTS.slice(0, dotIndex).map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
        {(stage === "line" || stage === "chess" || stage === "ready") && (
          <div style={{ marginTop: 24 }}>{reduceMotion ? LINE_TEXT : LINE_TEXT.slice(0, linePos)}</div>
        )}
        {(stage === "chess" || stage === "ready") && (
          <div style={{ marginTop: 28 }}>{reduceMotion ? CHESS_TEXT : CHESS_TEXT.slice(0, chessPos)}</div>
        )}
        {stage === "ready" && (
          <div style={{ marginTop: 32 }} className={styles.dim}>
            [ PRESS ANY KEY TO RETURN ]
            <span className={styles.cursor} aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}

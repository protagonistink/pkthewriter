"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createWoprAudioContext } from "./hooks/useWoprAudio";

type Cell = "" | "X" | "O";
type Board = Cell[];

const EMPTY: Board = ["", "", "", "", "", "", "", "", ""];

type Phase =
  | "greeting"
  | "choice"
  | "game-intro"
  | "player-turn"
  | "joshua-thinking"
  | "player-second"
  | "joshua-final"
  | "takeover-hold";

type Props = {
  onTakeover: (audioCtx: AudioContext | null) => void;
};

function chooseJoshuaMove(board: Board): number {
  if (board[4] === "") return 4;
  for (const i of [0, 2, 6, 8]) if (board[i] === "") return i;
  for (let i = 0; i < 9; i += 1) if (board[i] === "") return i;
  return -1;
}

export function WoprInPageResponse({ onTakeover }: Props) {
  const [phase, setPhase] = useState<Phase>("greeting");
  const [board, setBoard] = useState<Board>(EMPTY);
  const [greetingText, setGreetingText] = useState("");
  const [introText, setIntroText] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastMoveRef = useRef<number>(performance.now());
  const playerMoveCountRef = useRef(0);

  // Typewriter for greeting
  useEffect(() => {
    const text = "Shall we play a game?";
    if (phase !== "greeting") return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled || i >= text.length) {
        if (!cancelled) {
          setGreetingText(text);
          setTimeout(() => setPhase("choice"), 600);
        }
        return;
      }
      i += 1;
      setGreetingText(text.slice(0, i));
      setTimeout(tick, 40);
    };
    setTimeout(tick, 300);
    return () => { cancelled = true; };
  }, [phase]);

  // Typewriter for "Good choice."
  useEffect(() => {
    const text = "Good choice.";
    if (phase !== "game-intro") return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled || i >= text.length) {
        if (!cancelled) {
          setIntroText(text);
          setTimeout(() => setPhase("player-turn"), 500);
        }
        return;
      }
      i += 1;
      setIntroText(text.slice(0, i));
      setTimeout(tick, 40);
    };
    setTimeout(tick, 200);
    return () => { cancelled = true; };
  }, [phase]);

  // Inactivity timeout — if player doesn't move, Joshua takes over
  useEffect(() => {
    if (phase !== "player-turn" && phase !== "player-second") return;
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - lastMoveRef.current;
      if (elapsed >= 12000) {
        fireTakeover();
      }
    }, 500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const fireTakeover = useCallback(() => {
    setPhase("takeover-hold");
    if (!audioCtxRef.current) {
      audioCtxRef.current = createWoprAudioContext();
    }
    setTimeout(() => onTakeover(audioCtxRef.current), 400);
  }, [onTakeover]);

  const handleCellClick = useCallback(
    (idx: number) => {
      if (phase !== "player-turn" && phase !== "player-second") return;
      if (board[idx] !== "") return;
      const next = board.slice() as Board;
      next[idx] = "X";
      setBoard(next);
      lastMoveRef.current = performance.now();
      playerMoveCountRef.current += 1;

      if (playerMoveCountRef.current === 1) {
        setPhase("joshua-thinking");
        const delay = 1400 + Math.random() * 600;
        setTimeout(() => {
          const j = chooseJoshuaMove(next);
          if (j >= 0) {
            const after = next.slice() as Board;
            after[j] = "O";
            setBoard(after);
          }
          setPhase("player-second");
          lastMoveRef.current = performance.now();
        }, delay);
      } else {
        setPhase("joshua-final");
        const delay = 1100 + Math.random() * 400;
        setTimeout(() => {
          const j = chooseJoshuaMove(next);
          const after = next.slice() as Board;
          if (j >= 0) after[j] = "O";
          setBoard(after);
          setTimeout(() => fireTakeover(), 800);
        }, delay);
      }
    },
    [phase, board, fireTakeover],
  );

  function handleChoice() {
    setPhase("game-intro");
  }

  const statusText =
    phase === "joshua-thinking" || phase === "joshua-final"
      ? "Thinking…"
      : phase === "player-turn" || phase === "player-second"
        ? "Your move."
        : phase === "takeover-hold"
          ? ""
          : null;

  const showBoard =
    phase === "player-turn" ||
    phase === "joshua-thinking" ||
    phase === "player-second" ||
    phase === "joshua-final" ||
    phase === "takeover-hold";

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      {/* Greeting */}
      <p
        className="
          font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
          text-[var(--color-ink-mid)] mb-[22px]
        "
      >
        <span className="text-[var(--color-accent)] mr-1">→</span>
        {greetingText}
      </p>

      {/* Choice */}
      {phase === "choice" && (
        <div className="flex gap-[10px] mb-[22px]">
          <button
            type="button"
            onClick={handleChoice}
            className="
              font-[family-name:var(--font-mono)] text-[13px]
              min-h-[44px] px-[18px] py-[10px] rounded-full
              border border-[var(--color-paper-line)]
              text-[var(--color-ink-mid)]
              hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
              transition-colors cursor-pointer
            "
          >
            Tic-tac-toe
          </button>
          <span
            className="
              font-[family-name:var(--font-mono)] text-[13px]
              min-h-[44px] px-[18px] py-[10px] rounded-full
              border border-[var(--color-paper-line)]
              text-[var(--color-ink-faint)] cursor-not-allowed opacity-40
            "
          >
            Global Thermonuclear War
          </span>
        </div>
      )}

      {/* Game intro */}
      {(phase === "game-intro" || showBoard) && introText && (
        <p
          className="
            font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
            text-[var(--color-ink-mid)] mb-[22px]
          "
        >
          <span className="text-[var(--color-accent)] mr-1">→</span>
          {introText}
        </p>
      )}

      {/* Tic-tac-toe board on cream */}
      {showBoard && (
        <article
          className="
            overflow-hidden rounded-[22px]
            border border-[var(--color-paper-line)]
            shadow-[var(--shadow-soft)]
            p-[32px] flex flex-col items-center gap-[18px]
          "
          style={{
            background:
              "linear-gradient(180deg, var(--color-paper-panel) 0%, var(--color-paper) 100%)",
          }}
        >
          <CreamBoard
            cells={board}
            onCellClick={handleCellClick}
            locked={phase !== "player-turn" && phase !== "player-second"}
          />
          {statusText && (
            <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)]">
              {statusText}
            </p>
          )}
        </article>
      )}
    </section>
  );
}

function CreamBoard({
  cells,
  onCellClick,
  locked,
}: {
  cells: Board;
  onCellClick: (idx: number) => void;
  locked: boolean;
}) {
  const size = 300;
  const cell = size / 3;
  const lineColor = "var(--color-ink-soft)";
  const markColor = "var(--color-ink)";

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Tic-tac-toe board"
      style={{ width: "min(300px, 70vw)", height: "min(300px, 70vw)" }}
    >
      {/* Grid lines */}
      <line x1={cell} y1={12} x2={cell} y2={size - 12} stroke={lineColor} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      <line x1={cell * 2} y1={12} x2={cell * 2} y2={size - 12} stroke={lineColor} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      <line x1={12} y1={cell} x2={size - 12} y2={cell} stroke={lineColor} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
      <line x1={12} y1={cell * 2} x2={size - 12} y2={cell * 2} stroke={lineColor} strokeWidth={2} strokeLinecap="round" opacity={0.3} />

      {cells.map((c, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = col * cell + cell / 2;
        const cy = row * cell + cell / 2;
        const r = cell * 0.26;
        return (
          <g
            key={idx}
            onClick={() => onCellClick(idx)}
            style={{ cursor: locked || c !== "" ? "default" : "pointer" }}
          >
            <rect
              x={col * cell}
              y={row * cell}
              width={cell}
              height={cell}
              fill="transparent"
            />
            {!locked && c === "" && (
              <rect
                x={col * cell}
                y={row * cell}
                width={cell}
                height={cell}
                fill="transparent"
                className="hover:fill-[rgba(27,26,22,0.03)]"
                rx={4}
              />
            )}
            {c === "X" && (
              <>
                <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} stroke={markColor} strokeWidth={3} strokeLinecap="round" />
                <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} stroke={markColor} strokeWidth={3} strokeLinecap="round" />
              </>
            )}
            {c === "O" && (
              <circle cx={cx} cy={cy} r={r} stroke={markColor} strokeWidth={3} fill="none" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

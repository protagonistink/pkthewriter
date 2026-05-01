"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../wopr.module.css";

type Cell = "" | "X" | "O";
type Board = Cell[];

const EMPTY: Board = ["", "", "", "", "", "", "", "", ""];

const STATUS_INITIAL = "YOUR MOVE.";
const STATUS_THINKING = "JOSHUA THINKING...";
const STATUS_HMM = "STILL THERE?";
const STATUS_VERY_WELL = "VERY WELL.";
const STATUS_RUNNING_SIMS = "RUNNING EVERY POSSIBLE GAME.";

type SubPhase =
  | "act1-player"
  | "act1-joshua"
  | "act1-await-second"
  | "act1-final-joshua"
  | "act2-blur"
  | "act3-resolve";

const TOTAL_SIMS = 255168;

function chooseJoshuaMove(board: Board): number {
  // Simple priority: take center, then any corner, then any edge.
  if (board[4] === "") return 4;
  for (const i of [0, 2, 6, 8]) if (board[i] === "") return i;
  for (let i = 0; i < 9; i += 1) if (board[i] === "") return i;
  return -1;
}

function shuffledIndices(): number[] {
  const a = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TicTacToeBoard({
  initialPhase,
  reduceMotion,
  onClick,
  onTakeoverStart,
  onResolved,
}: {
  initialPhase: "act1-player" | "act2-blur";
  reduceMotion: boolean;
  onClick: () => void;
  onTakeoverStart: () => void;
  onResolved: () => void;
}) {
  const [phase, setPhase] = useState<SubPhase>(initialPhase);
  const [board, setBoard] = useState<Board>(EMPTY);
  const [status, setStatus] = useState<string>(
    initialPhase === "act2-blur" ? STATUS_RUNNING_SIMS : STATUS_INITIAL
  );
  const [statusJitter, setStatusJitter] = useState(false);
  const [simIndex, setSimIndex] = useState(initialPhase === "act2-blur" ? 1 : 0);
  const [blurBoard, setBlurBoard] = useState<Board>(EMPTY);
  const [flashKey, setFlashKey] = useState(0);
  const [flash, setFlash] = useState(false);
  const [boardJitter, setBoardJitter] = useState(false);
  const lastPlayerMoveRef = useRef<number>(performance.now());
  const playerMoveCountRef = useRef(0);

  const handleCellClick = useCallback(
    (idx: number) => {
      if (phase !== "act1-player" && phase !== "act1-await-second") return;
      if (board[idx] !== "") return;
      onClick();
      const next = board.slice();
      next[idx] = "X";
      setBoard(next);
      lastPlayerMoveRef.current = performance.now();
      playerMoveCountRef.current += 1;

      if (playerMoveCountRef.current === 1) {
        setPhase("act1-joshua");
        setStatus(STATUS_THINKING);
        // Slow first response — Joshua is "thinking." Drag the player in.
        const delay = 1700 + Math.random() * 600;
        window.setTimeout(() => {
          const j = chooseJoshuaMove(next);
          if (j >= 0) {
            const after = next.slice();
            after[j] = "O";
            setBoard(after);
          }
          setStatus(STATUS_INITIAL);
          setPhase("act1-await-second");
        }, delay);
      } else {
        // Second player move — Joshua thinks again, then plays its final O,
        // then briefly holds before the takeover. The hold is the moment
        // before the snap.
        setPhase("act1-final-joshua");
        setStatus(STATUS_THINKING);
        const delay = 1300 + Math.random() * 500;
        window.setTimeout(() => {
          const j = chooseJoshuaMove(next);
          const after = next.slice();
          if (j >= 0) after[j] = "O";
          setBoard(after);
          // Hold on the placed O for a beat — Joshua sees the board, registers
          // the dead-end, then snaps into simulation mode.
          window.setTimeout(() => startTakeover(), 900);
        }, delay);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, board, onClick]
  );

  const startTakeover = useCallback(() => {
    setStatus(STATUS_RUNNING_SIMS);
    setStatusJitter(false);
    setBoardJitter(true);
    setPhase("act2-blur");
    setBoard(EMPTY);
    setSimIndex(1);
    onTakeoverStart();
  }, [onTakeoverStart]);

  // PROFESSOR? prompt + auto-takeover after long inactivity.
  useEffect(() => {
    if (phase !== "act1-player" && phase !== "act1-await-second") return;
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - lastPlayerMoveRef.current;
      if (elapsed > 8000 && elapsed < 12000) {
        setStatus(STATUS_HMM);
        setStatusJitter(true);
      }
      if (elapsed >= 12000) {
        setStatus(STATUS_VERY_WELL);
        setStatusJitter(false);
        window.setTimeout(() => startTakeover(), 600);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [phase, startTakeover]);

  const [winnerStamp, setWinnerStamp] = useState(false);

  // Simulation loop — strict X/O alternation with exponential speedup.
  // Each "game" plays out move-by-move (X, O, X, O…) on a shuffled board.
  // The inter-move interval starts at ~600ms and decays exponentially to ~40ms.
  // After all 9 moves, a brief "Winner: NONE" stamp flashes before the next
  // game begins. As games accelerate, the stamp duration shrinks too.
  useEffect(() => {
    if (phase !== "act2-blur") return;
    if (reduceMotion) {
      window.setTimeout(() => setPhase("act3-resolve"), 200);
      return;
    }
    const DURATION_MS = 6500;
    const startedAt = performance.now();
    let cancelled = false;
    const timeouts: number[] = [];

    let moveQueue = shuffledIndices();
    let moveIndex = 0;
    let currentBoard: Board = ["", "", "", "", "", "", "", "", ""];

    const step = () => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;

      if (elapsed >= DURATION_MS) {
        setBoardJitter(false);
        setStatus("");
        setSimIndex(TOTAL_SIMS);
        setWinnerStamp(false);
        setPhase("act3-resolve");
        return;
      }

      const t = Math.min(1, elapsed / DURATION_MS);
      // Exponential decay: 600ms → 40ms
      const interval = 40 + 560 * Math.pow(1 - t, 2.5);
      // Counter accelerates non-linearly toward TOTAL_SIMS.
      const counterEased = Math.pow(t, 2.5);
      const counter = Math.min(TOTAL_SIMS, Math.max(1, Math.floor(counterEased * TOTAL_SIMS)));
      setSimIndex(counter);

      if (moveIndex >= 9) {
        // Game complete — flash "Winner: NONE" stamp, then start next game.
        setWinnerStamp(true);
        const stampDuration = Math.max(80, interval * 1.5);
        const stampTimeout = window.setTimeout(() => {
          if (cancelled) return;
          setWinnerStamp(false);
          moveQueue = shuffledIndices();
          moveIndex = 0;
          currentBoard = ["", "", "", "", "", "", "", "", ""];
          setBlurBoard(currentBoard);
          const nextTimeout = window.setTimeout(step, interval * 0.3);
          timeouts.push(nextTimeout);
        }, stampDuration);
        timeouts.push(stampTimeout);
        return;
      }

      // Place next move: strict alternation X, O, X, O…
      const cellIdx = moveQueue[moveIndex];
      currentBoard = currentBoard.slice() as Board;
      currentBoard[cellIdx] = moveIndex % 2 === 0 ? "X" : "O";
      moveIndex += 1;
      setBlurBoard(currentBoard);
      setFlashKey((k) => k + 1);

      if (t > 0.35) {
        setFlash(true);
        const flashOff = window.setTimeout(() => setFlash(false), 38);
        timeouts.push(flashOff);
      }

      const nextStep = window.setTimeout(step, interval);
      timeouts.push(nextStep);
    };

    const t0 = window.setTimeout(step, 600);
    timeouts.push(t0);

    return () => {
      cancelled = true;
      timeouts.forEach((tid) => clearTimeout(tid));
    };
  }, [phase, reduceMotion]);

  // Phase 2 Act 3 — the epiphany. Joshua realizes the game has no winner,
  // wonders if a different game would, asks about a larger game. The pacing
  // here is deliberately slow — it's the emotional center of the experience.
  const [resolveStep, setResolveStep] = useState(0);
  useEffect(() => {
    if (phase !== "act3-resolve") return;
    const timeouts: number[] = [];
    const step = (i: number, delay: number) => {
      timeouts.push(window.setTimeout(() => setResolveStep(i), delay));
    };
    // Step values:
    //  1: WINNER: NONE.
    //  2: + EVERY GAME ENDS THE SAME.
    //  3: + INTERESTING.
    //  4: + PERHAPS A DIFFERENT GAME.
    //  5: + > GLOBAL THERMONUCLEAR WAR?
    //  6: + > YES.
    step(1, 600);
    step(2, 2400);
    step(3, 4200);
    step(4, 5700);
    step(5, 7400);
    step(6, 9000);
    timeouts.push(window.setTimeout(onResolved, 10000));
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [phase, onResolved]);

  const isLocked = phase !== "act1-player" && phase !== "act1-await-second";
  const renderBoard = phase === "act2-blur" ? blurBoard : board;
  // Framed (in-site card) vs takeover (fullscreen black) is determined by
  // sub-phase. Act 1 — when the player still holds the pen — runs framed so
  // it feels like Joshua is just answering through the chat. Act 2+ — once
  // Joshua takes over — turns the world black.
  const framed = phase === "act1-player" || phase === "act1-await-second" || phase === "act1-joshua";
  const showBackdrop = !framed;

  return (
    <div className={`${styles.vectorRoot} ${framed ? styles.vectorFramed : ""}`}>
      <div
        className={`${styles.vectorBackdrop} ${showBackdrop ? styles.vectorBackdropVisible : ""}`}
        aria-hidden="true"
      />

      {framed && (
        <div className={styles.framedHeader}>
          <span className={styles.dot} />
          JOSHUA · CONNECTED
        </div>
      )}

      <div
        className={`${styles.boardFrame} ${boardJitter && !reduceMotion ? styles.boardJitter : ""} ${isLocked ? styles.cellLocked : ""}`}
      >
        <BoardSvg
          cells={renderBoard}
          onCellClick={handleCellClick}
          fastDraw={phase === "act2-blur"}
          markKey={flashKey}
        />
        {flash && !reduceMotion && <div className={styles.flash} key={`flash-${flashKey}`} />}
        {winnerStamp && phase === "act2-blur" && (
          <div className={styles.winnerStamp}>WINNER: NONE</div>
        )}
      </div>

      <div className={`${styles.statusLine} ${statusJitter ? styles.statusJitter : ""}`}>
        {phase === "act3-resolve" ? (
          <>
            {resolveStep >= 1 && <div>WINNER: NONE.</div>}
            {resolveStep >= 2 && <div style={{ marginTop: 14 }}>EVERY GAME ENDS THE SAME.</div>}
            {resolveStep >= 3 && <div style={{ marginTop: 14 }}>INTERESTING.</div>}
            {resolveStep >= 4 && <div style={{ marginTop: 14 }}>PERHAPS A DIFFERENT GAME.</div>}
            {resolveStep >= 5 && <div style={{ marginTop: 22 }}>&gt; GLOBAL THERMONUCLEAR WAR?</div>}
            {resolveStep >= 6 && <div>&gt; YES.</div>}
          </>
        ) : (
          status
        )}
      </div>

      {(phase === "act2-blur" || phase === "act3-resolve") && (
        <div className={styles.simCounter}>
          SIMULATION {simIndex.toLocaleString()} OF {TOTAL_SIMS.toLocaleString()}
        </div>
      )}
    </div>
  );
}

function BoardSvg({
  cells,
  onCellClick,
  fastDraw,
  markKey,
}: {
  cells: Board;
  onCellClick: (idx: number) => void;
  fastDraw: boolean;
  markKey: number;
}) {
  const size = 400;
  const cell = size / 3;
  return (
    <svg className={styles.boardSvg} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Tic-tac-toe board">
      {/* grid lines */}
      <line className={styles.boardLine} x1={cell} y1="20" x2={cell} y2={size - 20} />
      <line className={styles.boardLine} x1={cell * 2} y1="20" x2={cell * 2} y2={size - 20} />
      <line className={styles.boardLine} x1="20" y1={cell} x2={size - 20} y2={cell} />
      <line className={styles.boardLine} x1="20" y1={cell * 2} x2={size - 20} y2={cell * 2} />

      {cells.map((c, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = col * cell + cell / 2;
        const cy = row * cell + cell / 2;
        const r = cell * 0.28;
        return (
          <g
            key={idx}
            className={styles.cell}
            onClick={() => onCellClick(idx)}
            style={{ pointerEvents: "auto" }}
          >
            <rect
              className={styles.cellBg}
              x={col * cell}
              y={row * cell}
              width={cell}
              height={cell}
              fill="transparent"
            />
            {c === "X" && (
              <g key={`x-${idx}-${markKey}`}>
                <line
                  className={`${styles.markStroke} ${styles.markDraw} ${fastDraw ? styles.markFast : ""}`}
                  x1={cx - r}
                  y1={cy - r}
                  x2={cx + r}
                  y2={cy + r}
                />
                <line
                  className={`${styles.markStroke} ${styles.markDraw} ${fastDraw ? styles.markFast : ""}`}
                  x1={cx + r}
                  y1={cy - r}
                  x2={cx - r}
                  y2={cy + r}
                />
              </g>
            )}
            {c === "O" && (
              <circle
                key={`o-${idx}-${markKey}`}
                className={`${styles.markStroke} ${styles.markDraw} ${fastDraw ? styles.markFast : ""}`}
                cx={cx}
                cy={cy}
                r={r}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

// @ts-nocheck
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from "react";

const parseThreshold = (value: any, fallback: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getPerformanceLevel = (mountDurationMs: any, thresholdConfig: any) => {
  if (mountDurationMs === null) return "measuring";
  if (mountDurationMs < thresholdConfig.warningMs) return "good";
  if (mountDurationMs < thresholdConfig.slowMs) return "warning";
  return "slow";
};

const getPerformanceLabel = (performanceLevel) => {
  if (performanceLevel === "good") return "Good";
  if (performanceLevel === "warning") return "Warning";
  if (performanceLevel === "slow") return "Slow";
  return "Measuring";
};

const tones = {
  good: {
    badge: { border: "1px solid #6ee7b7", background: "#d1fae5", color: "#065f46" },
    tooltip: { border: "1px solid #6ee7b7", background: "#ecfdf5", color: "#064e3b" },
  },
  warning: {
    badge: { border: "1px solid #fcd34d", background: "#fef3c7", color: "#92400e" },
    tooltip: { border: "1px solid #fcd34d", background: "#fffbeb", color: "#78350f" },
  },
  slow: {
    badge: { border: "1px solid #fda4af", background: "#ffe4e6", color: "#9f1239" },
    tooltip: { border: "1px solid #fda4af", background: "#fff1f2", color: "#881337" },
  },
  measuring: {
    badge: { border: "1px solid #a5b4fc", background: "#e0e7ff", color: "#3730a3" },
    tooltip: { border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155" },
  },
};

const styles = {
  container: { position: "relative" },
  overlay: { position: "absolute", right: "0.5rem", top: "0.5rem", zIndex: 70 },
  badge: {
    height: "1.25rem",
    minWidth: "1.25rem",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 0.375rem",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "default",
  },
  tooltip: {
    position: "absolute",
    right: 0,
    top: "1.5rem",
    width: "18rem",
    maxWidth: "18rem",
    borderRadius: "0.375rem",
    padding: "0.25rem 0.5rem",
    fontSize: "11px",
    fontWeight: 500,
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    display: "none",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    lineHeight: 1.35,
  },
};

const FocusAreaLoadElement = ({ areaName, children }: any) => {
  const [mountDurationMs, setMountDurationMs] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasCapturedMount = useRef(false);
  const mountStartRef = useRef(
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now()
  );

  const isFalEnabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const searchParams = new URLSearchParams(window.location.search);
    const hashQuery = window.location.hash.includes("?")
      ? window.location.hash.slice(window.location.hash.indexOf("?"))
      : "";
    const hashParams = new URLSearchParams(hashQuery);

    const getParamValue = (key: any) => {
      if (searchParams.has(key)) {
        return searchParams.get(key);
      }

      if (hashParams.has(key)) {
        return hashParams.get(key);
      }

      return null;
    };

    const hasParam = (key: any) => searchParams.has(key) || hashParams.has(key);

    const showFalParam = (
      getParamValue("showfal") ??
      getParamValue("showFAL") ??
      getParamValue("showFal") ??
      ""
    )
      .trim()
      .toLowerCase();
    const hasFlag =
      hasParam("showfal") ||
      hasParam("showFAL") ||
      hasParam("showFal");
    return hasFlag && ["", "1", "true", "yes", "on"].includes(showFalParam);
  }, []);

  useEffect(() => {
    if (!isFalEnabled || hasCapturedMount.current) {
      return;
    }

    const resolveNow = () =>
      typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now()
        : Date.now();

    const finalizeDuration = () => {
      if (hasCapturedMount.current) {
        return;
      }

      const duration = Math.max(0, resolveNow() - mountStartRef.current);
      hasCapturedMount.current = true;
      setMountDurationMs(Number(duration.toFixed(2)));
    };

    const rafId =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(finalizeDuration)
        : null;

    const timeoutId = setTimeout(finalizeDuration, 120);

    return () => {
      if (rafId !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafId);
      }

      clearTimeout(timeoutId);
    };
  }, [isFalEnabled]);

  const thresholdConfig = useMemo(() => {
    const env = typeof process !== "undefined" ? process.env : undefined;
    const warningMs = parseThreshold(env?.VITE_FAL_WARNING_MS, 16);
    const slowMsRaw = parseThreshold(env?.VITE_FAL_SLOW_MS, 50);
    return { warningMs, slowMs: slowMsRaw > warningMs ? slowMsRaw : warningMs + 1 };
  }, []);

  const onRender = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      if (!isFalEnabled) return;
      if (phase === "mount") {
        hasCapturedMount.current = true;
        setMountDurationMs(Number(actualDuration.toFixed(2)));
      }

      console.info("[BusinessPage][Performance]", {
        focusArea: id,
        phase,
        actualDurationMs: Number(actualDuration.toFixed(2)),
        baseDurationMs: Number(baseDuration.toFixed(2)),
        startTimeMs: Number(startTime.toFixed(2)),
        commitTimeMs: Number(commitTime.toFixed(2)),
      });
    },
    [isFalEnabled]
  );

  const currentElapsedMs =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now() - mountStartRef.current
      : Date.now() - mountStartRef.current;
  const effectiveDurationMs = mountDurationMs ?? Math.max(0, Number(currentElapsedMs.toFixed(2)));

  const tooltipLabel =
    `${areaName} load: ${effectiveDurationMs.toFixed(2)} ms`;

  const performanceLevel = getPerformanceLevel(effectiveDurationMs, thresholdConfig);
  const performanceLabel = getPerformanceLabel(performanceLevel);
  const tooltipWithThresholds = `${tooltipLabel} · ${performanceLabel} (good < ${thresholdConfig.warningMs}ms, slow ≥ ${thresholdConfig.slowMs}ms)`;
  const mountDurationLabel = `${effectiveDurationMs.toFixed(0)}ms`;
  const tone = tones[performanceLevel];

  return React.createElement(
    "div",
    { style: styles.container },
    isFalEnabled
      ? React.createElement(
          "div",
          { style: styles.overlay },
          React.createElement(
            "div",
            {
              onMouseEnter: () => setIsHovering(true),
              onMouseLeave: () => setIsHovering(false),
              onFocus: () => setIsHovering(true),
              onBlur: () => setIsHovering(false),
            },
            React.createElement(
              "span",
              {
                "aria-label": tooltipLabel,
                title: tooltipLabel,
                tabIndex: 0,
                style: { ...styles.badge, ...tone.badge },
              },
              mountDurationLabel
            ),
            React.createElement(
              "div",
              {
                style: {
                  ...styles.tooltip,
                  ...tone.tooltip,
                  display: isHovering ? "block" : "none",
                },
              },
              tooltipWithThresholds
            )
          )
        )
      : null,
    React.createElement(Profiler, { id: areaName, onRender }, children)
  );
};

export default FocusAreaLoadElement;

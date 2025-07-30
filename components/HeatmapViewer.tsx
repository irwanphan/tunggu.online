"use client";

import { useEffect, useRef } from "react";
import h337 from "heatmap.js";

interface HeatmapViewerProps {
  clicks: { extra: { x: number; y: number } }[];
}

export default function HeatmapViewer({ clicks }: HeatmapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const heatmapInstance = h337.create({
      container: containerRef.current,
      radius: 40,
      maxOpacity: 0.6,
      blur: 0.9,
    });

    const points = clicks.map((c) => ({
      x: c.extra.x,
      y: c.extra.y,
      value: 1,
    }));

    heatmapInstance.setData({ min: 0, max: 5, data: points });
  }, [clicks]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "600px",
        position: "relative",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    />
  );
}

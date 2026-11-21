import type { DiagramNode } from "@/data/types";

interface CaseDiagramProps {
  readonly title: string;
  readonly nodes: readonly DiagramNode[];
  readonly variant: "compact" | "expanded";
}

interface DiagramRowLayout {
  readonly node: DiagramNode;
  readonly labelLines: readonly string[];
  readonly detailLines: readonly string[];
  readonly labelBlockH: number;
  readonly detailBlockH: number;
  readonly rowH: number;
}

interface PositionedDiagramRow extends DiagramRowLayout {
  readonly y: number;
  readonly centerY: number;
}

function splitLongToken(token: string, maxChars: number): string[] {
  const limit = Math.max(1, maxChars);
  if (token.length <= limit) {
    return [token];
  }
  const chunks: string[] = [];
  for (let i = 0; i < token.length; i += limit) {
    chunks.push(token.slice(i, i + limit));
  }
  return chunks;
}

function wrapLines(text: string, maxChars: number): string[] {
  const limit = Math.max(1, maxChars);
  const tokens = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongToken(word, limit));
  if (tokens.length === 0) return [];

  const lines: string[] = [];
  let current = tokens[0];

  for (let i = 1; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (`${current} ${token}`.length <= limit) {
      current = `${current} ${token}`;
    } else {
      lines.push(current);
      current = token;
    }
  }
  lines.push(current);
  return lines;
}

function positionRows(
  rows: readonly DiagramRowLayout[],
  padY: number,
  gapY: number,
): { positioned: readonly PositionedDiagramRow[]; totalHeight: number } {
  const positioned: PositionedDiagramRow[] = [];
  let cursorY = padY;

  for (const row of rows) {
    const y = cursorY;
    positioned.push({ ...row, y, centerY: y + row.rowH / 2 });
    cursorY += row.rowH + gapY;
  }

  return {
    positioned,
    totalHeight: cursorY - gapY + padY,
  };
}

function CornerTicks({
  width,
  height,
  inset,
  length,
}: {
  width: number;
  height: number;
  inset: number;
  length: number;
}) {
  const x0 = inset;
  const y0 = inset;
  const x1 = width - inset;
  const y1 = height - inset;

  return (
    <g stroke="var(--border)" strokeWidth="1" fill="none" opacity="0.65">
      <path d={`M ${x0} ${y0 + length} V ${y0} H ${x0 + length}`} />
      <path d={`M ${x1 - length} ${y0} H ${x1} V ${y0 + length}`} />
      <path d={`M ${x0} ${y1 - length} V ${y1} H ${x0 + length}`} />
      <path d={`M ${x1 - length} ${y1} H ${x1} V ${y1 - length}`} />
    </g>
  );
}

/**
 * Pure inline SVG architectural schematic rendering ordered flow nodes
 * using active theme tokens, with compact (home) and expanded (case detail) layouts.
 */
export function CaseDiagram({ title, nodes, variant }: CaseDiagramProps) {
  if (nodes.length === 0) {
    return null;
  }

  const isExpanded = variant === "expanded";
  const width = isExpanded ? 720 : 420;
  const padY = isExpanded ? 22 : 18;
  const spineX = isExpanded ? 30 : 32;
  const markerR = isExpanded ? 5 : 4.5;
  const boxX = isExpanded ? 52 : 56;
  const boxW = isExpanded ? 276 : 342;
  const boxPadX = 14;
  const rowPadY = isExpanded ? 12 : 11;
  const labelFontSize = isExpanded ? 13 : 12.5;
  const labelLineH = isExpanded ? 17 : 16;
  const detailFontSize = 13;
  const detailLineH = 18;
  const gapY = isExpanded ? 20 : 18;

  const detailX = 362;
  const detailW = 336;
  const detailPadX = 14;

  const layouts: DiagramRowLayout[] = nodes.map((node) => {
    const labelLines = wrapLines(node.label, isExpanded ? 28 : 35);
    const detailLines = isExpanded ? wrapLines(node.detail, 40) : [];
    const labelBlockH = labelLines.length * labelLineH;
    const detailBlockH = detailLines.length * detailLineH;
    const rowH = Math.max(labelBlockH, detailBlockH) + rowPadY * 2;
    return { node, labelLines, detailLines, labelBlockH, detailBlockH, rowH };
  });

  const { positioned, totalHeight } = positionRows(layouts, padY, gapY);
  const ariaLabel = `Fluxo arquitetural de ${title}: ${nodes.map((node) => node.label).join(", ")}`;

  const svg = (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${totalHeight}`}
      className={
        isExpanded ? "block h-auto w-full min-w-[38.75rem]" : "block h-auto w-full"
      }
    >
      <rect
        x="1"
        y="1"
        width={width - 2}
        height={totalHeight - 2}
        rx="6"
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <CornerTicks
        width={width}
        height={totalHeight}
        inset={isExpanded ? 10 : 8}
        length={isExpanded ? 10 : 8}
      />

      {positioned.map((item, index) => {
        const next = positioned[index + 1];
        const isEndpoint = index === 0 || index === positioned.length - 1;
        const isTerminal = index === positioned.length - 1;
        const labelStartY =
          item.y + (item.rowH - item.labelBlockH) / 2 + labelFontSize;
        const detailStartY =
          item.y + (item.rowH - item.detailBlockH) / 2 + detailFontSize;
        const arrowMidY = next ? (item.centerY + next.centerY) / 2 : 0;
        const arrowSpread = isExpanded ? 4 : 3.5;

        return (
          <g key={`${index}-${item.node.label}`}>
            {next ? (
              <g>
                <line
                  x1={spineX}
                  y1={item.centerY + markerR}
                  x2={spineX}
                  y2={next.centerY - markerR}
                  stroke="var(--border)"
                  strokeWidth="1.25"
                />
                <path
                  d={`M ${spineX - arrowSpread} ${arrowMidY - 2.5} L ${spineX} ${arrowMidY + 3.5} L ${spineX + arrowSpread} ${arrowMidY - 2.5}`}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ) : null}

            <line
              x1={spineX + markerR}
              y1={item.centerY}
              x2={boxX}
              y2={item.centerY}
              stroke={isTerminal ? "var(--signal)" : "var(--border)"}
              strokeWidth="1.25"
            />

            <circle
              cx={spineX}
              cy={item.centerY}
              r={markerR}
              fill={isEndpoint ? "var(--signal)" : "var(--card)"}
              stroke="var(--signal)"
              strokeWidth="1.5"
            />

            <rect
              x={boxX}
              y={item.y}
              width={boxW}
              height={item.rowH}
              rx="4"
              fill="var(--background)"
              stroke={isTerminal ? "var(--signal)" : "var(--border)"}
              strokeWidth={isTerminal ? "1.5" : "1.2"}
            />

            {isTerminal ? (
              <rect
                x={boxX}
                y={item.y}
                width={isExpanded ? "4" : "3.5"}
                height={item.rowH}
                rx="2"
                fill="var(--signal)"
              />
            ) : null}

            <text
              x={boxX + boxPadX}
              y={labelStartY}
              fill="var(--foreground)"
              fontSize={labelFontSize}
              fontWeight={isExpanded || isEndpoint ? "500" : "400"}
              textAnchor="start"
              style={{
                fontFamily:
                  "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {item.labelLines.map((line, lineIndex) => (
                <tspan
                  key={`${index}-label-${lineIndex}`}
                  x={boxX + boxPadX}
                  dy={lineIndex === 0 ? 0 : labelLineH}
                >
                  {line}
                  {lineIndex < item.labelLines.length - 1 ? " " : ""}
                </tspan>
              ))}
            </text>

            {isExpanded ? (
              <g>
                <line
                  x1={boxX + boxW}
                  y1={item.centerY}
                  x2={detailX}
                  y2={item.centerY}
                  stroke="var(--border)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <circle cx={detailX} cy={item.centerY} r="2.5" fill="var(--signal)" />

                <rect
                  x={detailX}
                  y={item.y}
                  width={detailW}
                  height={item.rowH}
                  rx="4"
                  fill="var(--card)"
                  stroke="var(--border)"
                  strokeWidth="1"
                />

                <text
                  x={detailX + detailPadX}
                  y={detailStartY}
                  fill="var(--muted-foreground)"
                  fontSize={detailFontSize}
                  textAnchor="start"
                  style={{
                    fontFamily:
                      "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  {item.detailLines.map((line, lineIndex) => (
                    <tspan
                      key={`${index}-detail-${lineIndex}`}
                      x={detailX + detailPadX}
                      dy={lineIndex === 0 ? 0 : detailLineH}
                    >
                      {line}
                      {lineIndex < item.detailLines.length - 1 ? " " : ""}
                    </tspan>
                  ))}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  return (
    <figure className="m-0 min-w-0">
      {isExpanded ? (
        <div tabIndex={0} className="overflow-x-auto overscroll-x-contain">
          {svg}
        </div>
      ) : (
        svg
      )}
    </figure>
  );
}

import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
}

type StitchAttachmentOpts = {
    firstStitchInRow: boolean;
    /** End of the previous row in stitch order — models yarn running from there to the first stitch of this row. */
    lastNodeOfPrevRow: PhysicsNode;
    color?: string;
};

function pushScStitch(
    nodes: PhysicsNode[],
    parentIndex: number,
    opts: StitchAttachmentOpts
): void {
    const nodeIndex = nodes.length;
    nodes.push(new PhysicsNode(opts.color));
    connectNodes(nodes[nodeIndex], nodes[parentIndex]);
    if (opts.firstStitchInRow) {
        connectNodes(nodes[nodeIndex], opts.lastNodeOfPrevRow);
    }
}

/**
 * Increase: `childCount` new stitches (default 2 for plain `inc`), all into the same parent.
 * Adjacent new stitches are linked in row order by the caller's within-row chain pass.
 */
function pushIncStitch(
    nodes: PhysicsNode[],
    parentIndex: number,
    childCount: number,
    opts: StitchAttachmentOpts
): void {
    if (childCount < 2) {
        throw new Error(`Increase must add at least 2 stitches, got ${childCount}`);
    }
    const startIndex = nodes.length;
    for (let k = 0; k < childCount; k++) {
        nodes.push(new PhysicsNode(opts.color));
    }
    for (let k = 0; k < childCount; k++) {
        connectNodes(nodes[startIndex + k], nodes[parentIndex]);
    }
    if (opts.firstStitchInRow) {
        connectNodes(nodes[startIndex], opts.lastNodeOfPrevRow);
    }
}

/** `inc` → 2 children; `inc3` / `inc4` → that many children. Returns null if not an increase stitch. */
function parseIncChildCount(stitch: string): number | null {
    if (stitch === "inc") {
        return 2;
    }
    const m = stitch.match(/^inc(\d+)$/);
    if (!m) {
        return null;
    }
    const n = parseInt(m[1], 10);
    if (!Number.isInteger(n) || n < 2) {
        throw new Error(`Increase must add at least 2 stitches (e.g. inc or inc3); got "${stitch}"`);
    }
    return n;
}

function pushDecStitch(
    nodes: PhysicsNode[],
    parentIndex1: number,
    parentIndex2: number,
    opts: StitchAttachmentOpts
): void {
    const nodeIndex = nodes.length;
    nodes.push(new PhysicsNode(opts.color));
    connectNodes(nodes[nodeIndex], nodes[parentIndex1]);
    connectNodes(nodes[nodeIndex], nodes[parentIndex2]);
    if (opts.firstStitchInRow) {
        connectNodes(nodes[nodeIndex], opts.lastNodeOfPrevRow);
    }
}

type LoopRowContext = {
    nodes: PhysicsNode[];
    nodesBeforePrevRow: number;
    prevRowCount: number;
    rowCounter: number;
    currentColor: string | undefined;
    lastNodeOfPrevRow: PhysicsNode;
};

function processLoopRoundRow(row: string[], ctx: LoopRowContext): number {
    let prevIndex = 0;
    const { nodes, nodesBeforePrevRow, prevRowCount, rowCounter, currentColor, lastNodeOfPrevRow } = ctx;

    for (const stitch of row) {
        const firstStitchInRow = prevIndex === 0;
        const stitchOpts = { firstStitchInRow, lastNodeOfPrevRow, color: currentColor };

        const incChildren = parseIncChildCount(stitch);
        if (incChildren !== null) {
            if (prevIndex >= prevRowCount) {
                throw new Error(`Row ${rowCounter}: Not enough parent stitches`);
            }
            pushIncStitch(nodes, nodesBeforePrevRow + prevIndex, incChildren, stitchOpts);
            prevIndex += 1;
            continue;
        }

        switch (stitch) {
            case "sc": {
                if (prevIndex >= prevRowCount) {
                    throw new Error(`Row ${rowCounter}: Not enough parent stitches`);
                }
                pushScStitch(nodes, nodesBeforePrevRow + prevIndex, stitchOpts);
                prevIndex += 1;
                break;
            }
            case "dec": {
                if (prevIndex + 1 >= prevRowCount) {
                    throw new Error(`Row ${rowCounter}: dec requires 2 parent stitches`);
                }
                pushDecStitch(
                    nodes,
                    nodesBeforePrevRow + prevIndex,
                    nodesBeforePrevRow + prevIndex + 1,
                    stitchOpts
                );
                prevIndex += 2;
                break;
            }
            default:
                throw new Error(`Unknown stitch type: ${stitch}`);
        }
    }
    return prevIndex;
}

type FlatLineRowContext = {
    nodes: PhysicsNode[];
    nodesBeforePrevRow: number;
    rowCounter: number;
    currentColor: string | undefined;
    lastNodeOfPrevRow: PhysicsNode;
};

function processFlatLineRow(row: string[], parentSeq: number[], ctx: FlatLineRowContext): number {
    let prevIndex = 0;
    const { nodes, nodesBeforePrevRow, rowCounter, currentColor, lastNodeOfPrevRow } = ctx;

    for (const stitch of row) {
        const firstStitchInRow = prevIndex === 0;
        const physicalParent = parentSeq[prevIndex];
        const stitchOpts: StitchAttachmentOpts = {
            firstStitchInRow,
            lastNodeOfPrevRow,
            color: currentColor,
        };
        const parentIndex = nodesBeforePrevRow + physicalParent;

        const incChildren = parseIncChildCount(stitch);
        if (incChildren !== null) {
            pushIncStitch(nodes, parentIndex, incChildren, stitchOpts);
            prevIndex += 1;
            continue;
        }

        switch (stitch) {
            case "sc":
                pushScStitch(nodes, parentIndex, stitchOpts);
                prevIndex += 1;
                break;
            case "dec":
                throw new Error(
                    `Row ${rowCounter}: dec is not supported after a chain row (flat row uses a backward walk)`
                );
            default:
                throw new Error(`Unknown stitch type: ${stitch}`);
        }
    }
    return prevIndex;
}

/** Physical parent indices 0..P-1 for each stitch: start at last (P-1), walk backward, bounce at ends repeating the corner stitch then reversing direction. */
function lineParentSequence(P: number, n: number): number[] {
    if (P < 1 || n < 1) {
        return [];
    }
    if (P === 1) {
        return Array.from({ length: n }, () => 0);
    }
    const seq: number[] = [];
    let pos = P - 1;
    let dir = -1;
    for (let i = 0; i < n; i++) {
        seq.push(pos);
        if (i === n - 1) {
            break;
        }
        const nextPos = pos + dir;
        if (nextPos < 0) {
            pos = 0;
            dir = 1;
            continue;
        }
        if (nextPos >= P) {
            pos = P - 1;
            dir = -1;
            continue;
        }
        pos = nextPos;
    }
    return seq;
}

/**
 * Flat line rows: parent indices run P−1, P−2, … for each stitch (no “return” along the row like a loop).
 * When n ≤ P this is exactly [P−1, …, P−n]. When n > P, reuse the bouncing walk from `lineParentSequence`.
 */
function flatLineParentSequence(P: number, n: number): number[] {
    if (P < 1 || n < 1) {
        return [];
    }
    if (n <= P) {
        return Array.from({ length: n }, (_, i) => P - 1 - i);
    }
    return lineParentSequence(P, n);
}

/**
 * Line → loop closing round: skip parent 0; go along C1..C_{P-1}, then back C_{P-1}..C1 (N = 2(P-1)).
 */
function chainToLoopParentSequence(P: number): number[] {
    const seq: number[] = [];
    for (let i = 1; i <= P - 1; i++) {
        seq.push(i);
    }
    for (let i = P - 1; i >= 1; i--) {
        seq.push(i);
    }
    return seq;
}

/** Line-to-loop skips parent C0; every other chain parent 1..P-1 must appear at least once. */
function assertChainToLoopConsumesAllParentsExceptSkipped(
    parentLocal: number[],
    P: number,
    rowCounter: number
): void {
    for (const idx of parentLocal) {
        if (idx < 1 || idx >= P) {
            throw new Error(
                `Row ${rowCounter}: line-to-loop row must only attach to parents 1..${P - 1} (C0 skipped), got ${idx}`
            );
        }
    }
    const used = new Set(parentLocal);
    for (let p = 1; p <= P - 1; p++) {
        if (!used.has(p)) {
            throw new Error(
                `Row ${rowCounter}: line-to-loop row must use every parent stitch from C1 to C${P - 1} (C0 skipped); missing parent index ${p}`
            );
        }
    }
}

function applyChainToLoopRow(
    row: string[],
    ctx: {
        nodes: PhysicsNode[];
        nodesBeforePrevRow: number;
        P: number;
        rowCounter: number;
        currentColor: string | undefined;
    }
): void {
    const n = row.length;
    const parentLocal = chainToLoopParentSequence(ctx.P);
    if (parentLocal.length !== n) {
        throw new Error(
            `Row ${ctx.rowCounter}: line-to-loop row must have exactly ${parentLocal.length} stitches (2(P-1)), got ${n}`
        );
    }
    const { nodes, nodesBeforePrevRow, rowCounter, currentColor } = ctx;
    const chainTipC0 = nodes[nodesBeforePrevRow];

    for (let si = 0; si < n; si++) {
        const parentIndex = nodesBeforePrevRow + parentLocal[si];
        const firstStitchInRow = si === 0;
        const stitchOpts = {
            firstStitchInRow,
            lastNodeOfPrevRow: chainTipC0,
            color: currentColor,
        };

        const stitch = row[si];
        const incChildren = parseIncChildCount(stitch);
        if (incChildren !== null) {
            pushIncStitch(nodes, parentIndex, incChildren, stitchOpts);
            continue;
        }
        switch (stitch) {
            case "sc":
                pushScStitch(nodes, parentIndex, stitchOpts);
                break;
            case "dec":
                throw new Error(
                    `Row ${rowCounter}: dec is not supported in a line-to-loop closing round`
                );
            default:
                throw new Error(`Unknown stitch type: ${stitch}`);
        }
    }
    assertChainToLoopConsumesAllParentsExceptSkipped(parentLocal, ctx.P, rowCounter);
}

/** True when the row has more than one stitch and its first and last nodes are neighbors (closed ring). */
export function rowFirstAndLastAreNeighbors(
    nodes: PhysicsNode[],
    rowStart: number,
    stitchCount: number
): boolean {
    if (stitchCount <= 1) {
        return false;
    }
    const first = nodes[rowStart];
    const last = nodes[rowStart + stitchCount - 1];
    return first.neighbors.includes(last);
}

function tokenizeStitches(input: string, separator = ","): string[] {
    return input
        .split(separator)
        .map((s) => s.trim())
        .map((s) => s.toLowerCase())
        .filter(Boolean);
}

type ParsedLine =
  | { type: "color"; value: string }
  | { type: "row"; stitches: string[] }
  | { type: "startMagicRing"; count: number }
  | { type: "startChain"; count: number };

function expandRowLine(line: string): string[] {
    const tokens = line.toLowerCase().match(/\(|\)|,|[a-zA-Z]+x\d+|inc\d+|x|\d+|[a-zA-Z]+/g);
    if (!tokens || tokens.length === 0) {
        return [];
    }

    const stitches: string[] = [];
    const groupStarts: number[] = [];
    let lastSingleStitchIndex: number | null = null;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === ",") {
            lastSingleStitchIndex = null;
            continue;
        }

        if (token === "(") {
            groupStarts.push(stitches.length);
            lastSingleStitchIndex = null;
            continue;
        }

        if (token === ")") {
            if (groupStarts.length === 0) {
                throw new Error("Unmatched closing parenthesis in row");
            }

            const xToken = tokens[i + 1];
            const countToken = tokens[i + 2];
            const count = Number(countToken);

            if (xToken !== "x" || !Number.isInteger(count) || count < 1) {
                throw new Error("Parenthesized group must be followed by x and a positive integer");
            }

            const groupStart = groupStarts.pop() as number;
            const group = stitches.slice(groupStart);
            stitches.length = groupStart;

            for (let j = 0; j < count; j++) {
                stitches.push(...group);
            }

            i += 2;
            lastSingleStitchIndex = null;
            continue;
        }

        if (token === "x") {
            const countToken = tokens[i + 1];
            const count = Number(countToken);

            if (!Number.isInteger(count) || count < 1) {
                throw new Error("Single stitch multiplier must use x and a positive integer");
            }
            if (lastSingleStitchIndex === null) {
                throw new Error("Single stitch multiplier x must follow a stitch");
            }

            const stitch = stitches[lastSingleStitchIndex];
            for (let j = 1; j < count; j++) {
                stitches.push(stitch);
            }

            i += 1;
            lastSingleStitchIndex = null;
            continue;
        }

        if (/^\d+$/.test(token)) {
            throw new Error("Unexpected number in row");
        }

        const singleStitchWithMultiplier = token.match(/^([a-zA-Z]+)x(\d+)$/);
        if (singleStitchWithMultiplier) {
            const stitch = singleStitchWithMultiplier[1];
            const count = Number(singleStitchWithMultiplier[2]);

            if (!Number.isInteger(count) || count < 1) {
                throw new Error("Single stitch multiplier must use x and a positive integer");
            }

            for (let j = 0; j < count; j++) {
                stitches.push(stitch);
            }

            lastSingleStitchIndex = null;
            continue;
        }

        stitches.push(token);
        lastSingleStitchIndex = stitches.length - 1;
    }

    if (groupStarts.length > 0) {
        throw new Error("Unclosed parenthesis in row");
    }

    return stitches;
}

function parsePatternLines(pattern: string): ParsedLine[] {
    const lines = tokenizeStitches(pattern, "\n");
    const result: ParsedLine[] = [];

    for (const line of lines) {
        if (line.trimStart().startsWith("//")) {
            continue;
        }

        // color line (word or hex)
        if (/^([a-zA-Z]+|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))$/.test(line)) {
            result.push({ type: "color", value: line });
            continue;
        }

        const mr = line.match(/^\s*mr\s*(\d+)\s*$/i);
        if (mr) {
            const count = parseInt(mr[1], 10);
            if (count < 1) {
                throw new Error("Magic ring stitch count must be at least 1");
            }
            result.push({ type: "startMagicRing", count });
            continue;
        }

        const ch = line.match(/^\s*ch\s*(\d+)\s*$/i);
        if (ch) {
            const count = parseInt(ch[1], 10);
            if (count < 3) {
                throw new Error(
                    "Chain stitch count must be at least 3 (shorter chains make P vs 2(P-1) ambiguous on the first row)"
                );
            }
            result.push({ type: "startChain", count });
            continue;
        }

        const stitches = expandRowLine(line);
        if (stitches.length > 0) {
            result.push({ type: "row", stitches });
        }
    }
    return result;
}

export const createParsedGraph = (pattern: string): { nodes: PhysicsNode[]; lastRowIsLoop: boolean } => {
    const nodes: PhysicsNode[] = [];

    const parsedLines = parsePatternLines(pattern);
    
    let currentColor: string | undefined = undefined;

    let prevRowCount = 0;
    let nodesBeforePrevRow = 0;
    let rowCounter = 0;
    /** True when the previous row is worked in the round (not a flat chain row). */
    let prevRowWasLoopRound: boolean = false;
    /** Index of first chain stitch (C0) after `ch`; cleared after the first stitch row on that chain. */
    let chainFoundationFirstNode: number | null = null;

    for (const entry of parsedLines) {
        if (entry.type === "color") {
            currentColor = entry.value;
            continue;
        }

        if (entry.type === "startMagicRing" || entry.type === "startChain") {
            if (nodes.length !== 0) {
                throw new Error(
                    `${entry.type === "startMagicRing" ? "mr" : "ch"} must be the first stitch row (only color lines may precede it)`
                );
            }
        }

        rowCounter++;

        if (entry.type === "startMagicRing") {
            const currentRowCountStart = nodes.length;
            for (let i = 0; i < entry.count; i++) {
                nodes.push(new PhysicsNode(currentColor));
            }
            const currentRowCount = nodes.length - currentRowCountStart;
            if (currentRowCount > 1) {
                for (let i = 1; i < currentRowCount; i++) {
                    connectNodes(nodes[currentRowCountStart + i - 1], nodes[currentRowCountStart + i]);
                }
                connectNodes(nodes[currentRowCountStart], nodes[nodes.length - 1]);
            }
            nodesBeforePrevRow = currentRowCountStart;
            prevRowCount = currentRowCount;
            prevRowWasLoopRound = true;
            continue;
        }

        if (entry.type === "startChain") {
            const currentRowCountStart = nodes.length;
            for (let i = 0; i < entry.count; i++) {
                nodes.push(new PhysicsNode(currentColor));
            }
            const currentRowCount = nodes.length - currentRowCountStart;
            if (currentRowCount > 1) {
                for (let i = 1; i < currentRowCount; i++) {
                    connectNodes(nodes[currentRowCountStart + i - 1], nodes[currentRowCountStart + i]);
                }
            }
            nodesBeforePrevRow = currentRowCountStart;
            prevRowCount = currentRowCount;
            prevRowWasLoopRound = false;
            chainFoundationFirstNode = currentRowCountStart;
            continue;
        }

        const row = entry.stitches;
        const currentRowCountStart = nodes.length;
        let prevIndex = 0;

        if (nodes.length === 0) {
            throw new Error(
                `Row ${rowCounter}: start with mr<number> or ch<number> (e.g. mr6 or ch6); optional color lines may come first`
            );
        }

        {
            const parentWasLoopRound: boolean = prevRowWasLoopRound;
            const P = prevRowCount;
            const n = row.length;

            const isFirstRowAfterChain: boolean =
                chainFoundationFirstNode !== null && !parentWasLoopRound;

            if (isFirstRowAfterChain) {
                if (n !== P && n !== 2 * (P - 1)) {
                    throw new Error(
                        `Row ${rowCounter}: First row after a starting chain must have exactly P (${P}) stitches (flat line) or 2(P-1) (${2 * (P - 1)}) stitches (line to loop); got ${n}`
                    );
                }
            }

            /** First working row after `ch` with N = 2(P−1) closes the chain into a loop. */
            const isChainToLoopRound: boolean =
                isFirstRowAfterChain && n === 2 * (P - 1);

            const lastNodeOfPrevRow = nodes[nodesBeforePrevRow + prevRowCount - 1];

            if (parentWasLoopRound) {
                prevIndex = processLoopRoundRow(row, {
                    nodes,
                    nodesBeforePrevRow,
                    prevRowCount,
                    rowCounter,
                    currentColor,
                    lastNodeOfPrevRow,
                });
            } else if (isChainToLoopRound) {
                applyChainToLoopRow(row, {
                    nodes,
                    nodesBeforePrevRow,
                    P,
                    rowCounter,
                    currentColor,
                });
            } else {
                const parentSeq = flatLineParentSequence(P, n);
                if (parentSeq.length !== n) {
                    throw new Error(`Row ${rowCounter}: invalid line parent sequence`);
                }
                prevIndex = processFlatLineRow(row, parentSeq, {
                    nodes,
                    nodesBeforePrevRow,
                    rowCounter,
                    currentColor,
                    lastNodeOfPrevRow,
                });
            }

            prevRowWasLoopRound = parentWasLoopRound || isChainToLoopRound;

            if (parentWasLoopRound) {
                if (prevIndex !== prevRowCount) {
                    throw new Error(
                        `Row ${rowCounter}: Expected to consume ${prevRowCount} parent stitches, but consumed ${prevIndex}`
                    );
                }
            } else if (!isChainToLoopRound) {
                if (prevIndex !== n) {
                    throw new Error(
                        `Row ${rowCounter}: Expected ${n} stitches in this row, but processed ${prevIndex}`
                    );
                }
            }
        }

        const currentRowCount = nodes.length - currentRowCountStart;

        if (currentRowCount > 1) {
            for (let i = 1; i < currentRowCount; i++) {
                connectNodes(nodes[currentRowCountStart + i - 1], nodes[currentRowCountStart + i]);
            }
        }

        // Do not connect chain tip C0 to the first sc on flat rows — that edge closes a loop around the foundation.
        if (chainFoundationFirstNode !== null) {
            chainFoundationFirstNode = null;
        }

        nodesBeforePrevRow = currentRowCountStart;
        prevRowCount = currentRowCount;
    }

    const lastRowIsLoop = prevRowCount > 0 && prevRowWasLoopRound;

    return { nodes, lastRowIsLoop };
}

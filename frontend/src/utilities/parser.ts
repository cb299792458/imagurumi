import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
}

const INC_STITCH_RE = /^inc(\d+)$/;
const ROW_TOKEN_RE = /\(|\)|,|[a-zA-Z]+x\d+|inc\d+|x|\d+|[a-zA-Z]+/g;
const UNEXPECTED_NUMBER_RE = /^\d+$/;
const SINGLE_STITCH_WITH_MULTIPLIER_RE = /^([a-zA-Z]+)x(\d+)$/;
const COLOR_LINE_RE = /^([a-zA-Z]+|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))$/;
const MAGIC_RING_RE = /^\s*mr\s*(\d+)\s*$/i;
const CHAIN_RE = /^\s*ch\s*(\d+)\s*$/i;

type StitchAttachmentOpts = {
    firstStitchInRow: boolean;
    /** End of the previous row in stitch order — models yarn running from there to the first stitch of this row. */
    lastNodeOfPrevRow: PhysicsNode;
    color?: string;
};

type RowContextBase = {
    nodes: PhysicsNode[];
    nodesBeforePrevRow: number;
    rowCounter: number;
    currentColor: string | undefined;
    lastNodeOfPrevRow: PhysicsNode;
};

type LoopRowContext = RowContextBase & {
    prevRowCount: number;
};

type FlatLineRowContext = RowContextBase;

type AlongChainRowContext = {
    nodes: PhysicsNode[];
    nodesBeforePrevRow: number;
    parentRowCount: number;
    rowCounter: number;
    currentColor: string | undefined;
};

type ParsedLine =
    | { type: "color"; value: string }
    | { type: "row"; stitches: string[] }
    | { type: "startMagicRing"; count: number }
    | { type: "startChain"; count: number };

function makeStitchOpts(
    firstStitchInRow: boolean,
    lastNodeOfPrevRow: PhysicsNode,
    color: string | undefined
): StitchAttachmentOpts {
    return { firstStitchInRow, lastNodeOfPrevRow, color };
}

function connectAdjacentNodesInRow(nodes: PhysicsNode[], rowStart: number, rowCount: number): void {
    for (let i = 1; i < rowCount; i++) {
        connectNodes(nodes[rowStart + i - 1], nodes[rowStart + i]);
    }
}

function rowErr(rowCounter: number, detail: string): Error {
    return new Error(`Row ${rowCounter}: ${detail}`);
}

function pushScStitch(
    nodes: PhysicsNode[],
    parentIndex: number,
    opts: StitchAttachmentOpts
): void {
    const newStitch = new PhysicsNode(opts.color);
    nodes.push(newStitch);
    connectNodes(newStitch, nodes[parentIndex]);
    if (opts.firstStitchInRow) {
        connectNodes(newStitch, opts.lastNodeOfPrevRow);
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
    const m = stitch.match(INC_STITCH_RE);
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
    if (Math.abs(parentIndex2 - parentIndex1) !== 1) {
        throw new Error(
            `dec expects adjacent parent indices; got ${parentIndex1} and ${parentIndex2}`
        );
    }
    const nodeIndex = nodes.length;
    nodes.push(new PhysicsNode(opts.color));
    connectNodes(nodes[nodeIndex], nodes[parentIndex1]);
    connectNodes(nodes[nodeIndex], nodes[parentIndex2]);
    if (opts.firstStitchInRow) {
        connectNodes(nodes[nodeIndex], opts.lastNodeOfPrevRow);
    }
}

/**
 * Applies sc/inc* stitches and returns how many parent stitches were consumed.
 * Returns null for dec so callers can enforce mode-specific dec rules.
 */
function applyScOrIncStitch(
    stitch: string,
    nodes: PhysicsNode[],
    parentIndex: number,
    stitchOpts: StitchAttachmentOpts
): number | null {
    const incChildren = parseIncChildCount(stitch);
    if (incChildren !== null) {
        pushIncStitch(nodes, parentIndex, incChildren, stitchOpts);
        return 1;
    }
    if (stitch === "sc") {
        pushScStitch(nodes, parentIndex, stitchOpts);
        return 1;
    }
    if (stitch === "dec") {
        return null;
    }
    throw new Error(`Unknown stitch type: ${stitch}`);
}

/** Number of parent stitches consumed by one stitch token in flat/linear traversal. */
function parentConsumptionForStitch(stitch: string): number {
    if (stitch === "dec") {
        return 2;
    }
    if (stitch === "sc" || parseIncChildCount(stitch) !== null) {
        return 1;
    }
    throw new Error(`Unknown stitch type: ${stitch}`);
}

function parentConsumptionForRow(row: string[], rowCounter: number): number {
    try {
        return row.reduce((total, stitch) => total + parentConsumptionForStitch(stitch), 0);
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Unknown stitch type:")) {
            throw rowErr(rowCounter, error.message);
        }
        throw error;
    }
}

function processLoopRoundRow(row: string[], ctx: LoopRowContext): number {
    let parentCursor = 0;
    const { nodes, nodesBeforePrevRow, prevRowCount, rowCounter, currentColor, lastNodeOfPrevRow } = ctx;

    for (const stitch of row) {
        const stitchOpts = makeStitchOpts(parentCursor === 0, lastNodeOfPrevRow, currentColor);

        if (parentCursor >= prevRowCount) {
            throw rowErr(rowCounter, "Not enough parent stitches");
        }

        const consumedParents = applyScOrIncStitch(
            stitch,
            nodes,
            nodesBeforePrevRow + parentCursor,
            stitchOpts
        );
        if (consumedParents !== null) {
            parentCursor += consumedParents;
            continue;
        }

        if (parentCursor + 1 >= prevRowCount) {
            throw rowErr(rowCounter, "dec requires 2 parent stitches");
        }
        pushDecStitch(
            nodes,
            nodesBeforePrevRow + parentCursor,
            nodesBeforePrevRow + parentCursor + 1,
            stitchOpts
        );
        parentCursor += 2;
    }
    return parentCursor;
}

function processFlatLineRow(row: string[], parentSeq: number[], ctx: FlatLineRowContext): number {
    let parentCursor = 0;
    const { nodes, nodesBeforePrevRow, rowCounter, currentColor, lastNodeOfPrevRow } = ctx;

    for (const stitch of row) {
        const stitchOpts = makeStitchOpts(parentCursor === 0, lastNodeOfPrevRow, currentColor);
        const firstParent = parentSeq[parentCursor];
        if (firstParent === undefined) {
            throw rowErr(rowCounter, "Not enough parent stitches");
        }
        const parentIndex = nodesBeforePrevRow + firstParent;

        const consumedParents = applyScOrIncStitch(stitch, nodes, parentIndex, stitchOpts);
        if (consumedParents !== null) {
            parentCursor += consumedParents;
            continue;
        }

        const secondParent = parentSeq[parentCursor + 1];
        if (secondParent === undefined) {
            throw rowErr(rowCounter, "dec requires 2 parent stitches");
        }
        if (secondParent === firstParent) {
            throw rowErr(
                rowCounter,
                "dec requires 2 distinct parent stitches; encountered a corner bounce repeat"
            );
        }
        pushDecStitch(
            nodes,
            nodesBeforePrevRow + firstParent,
            nodesBeforePrevRow + secondParent,
            stitchOpts
        );
        parentCursor += 2;
    }
    return parentCursor;
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
 * Flat rectangle along a starting chain: skip C0 on the first pass (C1..C_{P-1}), turn at C_{P-1},
 * then work back skipping that corner (C_{P-2}..C0). N = 2(P−1) stitches.
 */
function rectangleFlatAlongChainParentSequence(P: number): number[] {
    const seq: number[] = [];
    for (let i = 1; i <= P - 1; i++) {
        seq.push(i);
    }
    for (let i = P - 2; i >= 0; i--) {
        seq.push(i);
    }
    return seq;
}

/**
 * Rows that walk the chain with turns repeat a corner index twice (same foundation stitch on
 * opposite passes). If the first of two identical parents was an increase, the next stitch must
 * attach to the neighbor inward — not again into the corner (right turn: P−1 → P−2; left turn at 0 → 1).
 */
function adjustParentsAfterCornerIncrease(parentLocal: number[], row: string[], P: number): void {
    if (P < 2) {
        return;
    }
    for (let i = 1; i < parentLocal.length; i++) {
        if (parentLocal[i] !== parentLocal[i - 1]) {
            continue;
        }
        if (parseIncChildCount(row[i - 1]) === null) {
            continue;
        }
        const p = parentLocal[i];
        if (p === P - 1) {
            parentLocal[i] = P - 2;
        } else if (p === 0) {
            parentLocal[i] = 1;
        }
    }
}

function applyRectangleFlatAlongChainRow(
    row: string[],
    ctx: AlongChainRowContext
): void {
    const n = row.length;
    const baseSequence = rectangleFlatAlongChainParentSequence(ctx.parentRowCount);
    if (baseSequence.length !== n) {
        throw rowErr(
            ctx.rowCounter,
            `flat along-chain row must have exactly ${baseSequence.length} stitches (2(P-1)), got ${n}`
        );
    }
    const parentLocal = baseSequence.slice();
    adjustParentsAfterCornerIncrease(parentLocal, row, ctx.parentRowCount);
    const { nodes, nodesBeforePrevRow, rowCounter, currentColor } = ctx;
    const chainTipC0 = nodes[nodesBeforePrevRow];

    for (let si = 0; si < n; si++) {
        const parentIndex = nodesBeforePrevRow + parentLocal[si];
        const stitchOpts = makeStitchOpts(si === 0, chainTipC0, currentColor);

        const consumedParents = applyScOrIncStitch(row[si], nodes, parentIndex, stitchOpts);
        if (consumedParents === null) {
            throw rowErr(rowCounter, "dec is not supported in a flat along-chain row");
        }
    }
}

function tokenizeStitches(input: string, separator = ","): string[] {
    return input
        .split(separator)
        .map((s) => s.trim())
        .map((s) => s.toLowerCase())
        .filter(Boolean);
}

/** Expects a line already lowercased (see `tokenizeStitches`). */
function expandRowLine(line: string): string[] {
    const tokens = line.match(ROW_TOKEN_RE);
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

        if (UNEXPECTED_NUMBER_RE.test(token)) {
            throw new Error("Unexpected number in row");
        }

        const singleStitchWithMultiplier = token.match(SINGLE_STITCH_WITH_MULTIPLIER_RE);
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
        if (COLOR_LINE_RE.test(line)) {
            result.push({ type: "color", value: line });
            continue;
        }

        const mr = line.match(MAGIC_RING_RE);
        if (mr) {
            const count = parseInt(mr[1], 10);
            if (count < 1) {
                throw new Error("Magic ring stitch count must be at least 1");
            }
            result.push({ type: "startMagicRing", count });
            continue;
        }

        const ch = line.match(CHAIN_RE);
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

    let currentColor: string | undefined;

    let prevRowCount = 0;
    let nodesBeforePrevRow = 0;
    let rowCounter = 0;
    /** True when the previous row is worked in the round (not a flat chain row). */
    let prevRowWasLoopRound: boolean = false;
    /** Index of first chain stitch (C0) after `ch`; cleared after the first stitch row on that chain. */
    let chainFoundationFirstNode: number | null = null;
    /** After `ch` + flat along-chain row (2(P−1) first row), the next loop round should close (first ↔ last stitch). */
    let ringCloseFirstLoopAfterChain: boolean = false;

    const indexOfLastStitchRow = parsedLines.reduce(
        (last, line, i) => (line.type === "row" ? i : last),
        -1
    );

    for (let parsedLineIndex = 0; parsedLineIndex < parsedLines.length; parsedLineIndex++) {
        const entry = parsedLines[parsedLineIndex];
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
                connectAdjacentNodesInRow(nodes, currentRowCountStart, currentRowCount);
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
                connectAdjacentNodesInRow(nodes, currentRowCountStart, currentRowCount);
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
        /** Incoming: previous row was worked in the round → this row uses `processLoopRoundRow`. */
        const rowParentIsLoopRound = prevRowWasLoopRound;

        if (nodes.length === 0) {
            throw rowErr(
                rowCounter,
                "start with mr<number> or ch<number> (e.g. mr6 or ch6); optional color lines may come first"
            );
        }

        {
            const parentWasLoopRound: boolean = prevRowWasLoopRound;
            const parentRowCount = prevRowCount;
            const rowStitchCount = row.length;
            const flatRowParentConsumption = parentConsumptionForRow(row, rowCounter);

            const isFirstRowAfterChain: boolean =
                chainFoundationFirstNode !== null && !parentWasLoopRound;

            const twoPassAlongChainStitchCount = 2 * (parentRowCount - 1);

            if (isFirstRowAfterChain) {
                const isFlatFirstRowValid = flatRowParentConsumption === parentRowCount;
                const isTwoPassAlongChainValid = rowStitchCount === twoPassAlongChainStitchCount;
                if (!isFlatFirstRowValid && !isTwoPassAlongChainValid) {
                    throw rowErr(
                        rowCounter,
                        `First row after a starting chain must consume exactly P (${parentRowCount}) parent stitches (one pass) or have exactly 2(P-1) (${twoPassAlongChainStitchCount}) stitches (flat out-and-back along the chain); got ${rowStitchCount} stitches consuming ${flatRowParentConsumption} parents`
                    );
                }
            }

            /** First working row after `ch` with 2(P−1) stitches: flat along chain (skip C0 out, skip turn stitch back). */
            const isRectangleFlatAlongChainRow: boolean =
                isFirstRowAfterChain && rowStitchCount === twoPassAlongChainStitchCount;

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
            } else if (isRectangleFlatAlongChainRow) {
                applyRectangleFlatAlongChainRow(row, {
                    nodes,
                    nodesBeforePrevRow,
                    parentRowCount,
                    rowCounter,
                    currentColor,
                });
                prevIndex = flatRowParentConsumption;
            } else {
                const parentSeq = flatLineParentSequence(parentRowCount, flatRowParentConsumption);
                if (parentSeq.length !== flatRowParentConsumption) {
                    throw rowErr(rowCounter, "invalid line parent sequence");
                }
                if (flatRowParentConsumption > parentRowCount) {
                    adjustParentsAfterCornerIncrease(parentSeq, row, parentRowCount);
                }
                prevIndex = processFlatLineRow(row, parentSeq, {
                    nodes,
                    nodesBeforePrevRow,
                    rowCounter,
                    currentColor,
                    lastNodeOfPrevRow,
                });
            }

            prevRowWasLoopRound = parentWasLoopRound || isRectangleFlatAlongChainRow;

            if (isRectangleFlatAlongChainRow) {
                ringCloseFirstLoopAfterChain = true;
            }

            const isLastStitchRow = parsedLineIndex === indexOfLastStitchRow;
            if (!isLastStitchRow) {
                if (parentWasLoopRound) {
                    if (prevIndex !== prevRowCount) {
                        throw rowErr(
                            rowCounter,
                            `Expected to consume ${prevRowCount} parent stitches, but consumed ${prevIndex}`
                        );
                    }
                } else if (!isRectangleFlatAlongChainRow) {
                    if (prevIndex !== flatRowParentConsumption) {
                        throw rowErr(
                            rowCounter,
                            `Expected to consume ${flatRowParentConsumption} parent stitches in this row, but consumed ${prevIndex}`
                        );
                    }
                }
            }
        }

        const currentRowCount = nodes.length - currentRowCountStart;

        if (currentRowCount > 1) {
            connectAdjacentNodesInRow(nodes, currentRowCountStart, currentRowCount);
            if (ringCloseFirstLoopAfterChain && rowParentIsLoopRound) {
                connectNodes(nodes[currentRowCountStart], nodes[nodes.length - 1]);
                ringCloseFirstLoopAfterChain = false;
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

import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
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
  | { type: "row"; stitches: string[] };

function expandRowLine(line: string): string[] {
    const tokens = line.toLowerCase().match(/\(|\)|,|[a-zA-Z]+x\d+|x|\d+|[a-zA-Z]+/g);
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
        // color line (word or hex)
        if (/^([a-zA-Z]+|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))$/.test(line)) {
            result.push({ type: "color", value: line });
            continue;
        }

        const stitches = expandRowLine(line);
        if (stitches.length > 0) {
            result.push({ type: "row", stitches });
        }
    }
    return result;
}

export const createParsedGraph = (pattern: string): { nodes: PhysicsNode[] } => {
    const nodes: PhysicsNode[] = [];

    const parsedLines = parsePatternLines(pattern);
    
    let currentColor: string | undefined = undefined;

    let prevRowCount = 0;
    let nodesBeforePrevRow = 0;
    let rowCounter = 0;

    for (const entry of parsedLines) {
        if (entry.type === "color") {
            currentColor = entry.value;
            continue;
        }

        rowCounter++;

        const row = entry.stitches;
        const currentRowCountStart = nodes.length;
        let prevIndex = 0;

        if (nodes.length === 0) {
            for (let i = 0; i < row.length; i++) {
                nodes.push(new PhysicsNode(currentColor));
            }
        } else {
            for (const stitch of row) {
                switch (stitch) {
                    case "sc": {
                        if (prevIndex >= prevRowCount) {
                            throw new Error(`Row ${rowCounter}: Not enough parent stitches`);
                        }
                        const nodeIndex = nodes.length;
                        const parentIndex = nodesBeforePrevRow + prevIndex;

                        nodes.push(new PhysicsNode(currentColor));
                        connectNodes(nodes[nodeIndex], nodes[parentIndex]);

                        prevIndex += 1;
                        break;
                    }

                    case "inc": {
                        if (prevIndex >= prevRowCount) {
                            throw new Error(`Row ${rowCounter}: Not enough parent stitches`);
                        }
                        const parentIndex = nodesBeforePrevRow + prevIndex;

                        const nodeIndex1 = nodes.length;
                        const nodeIndex2 = nodes.length + 1;

                        nodes.push(new PhysicsNode(currentColor), new PhysicsNode(currentColor));

                        connectNodes(nodes[nodeIndex1], nodes[parentIndex]);
                        connectNodes(nodes[nodeIndex2], nodes[parentIndex]);

                        prevIndex += 1;
                        break;
                    }

                    case "dec": {
                        if (prevIndex + 1 >= prevRowCount) {
                            throw new Error(`Row ${rowCounter}: dec requires 2 parent stitches`);
                        }
                        const parentIndex1 = nodesBeforePrevRow + prevIndex;
                        const parentIndex2 = nodesBeforePrevRow + prevIndex + 1;
                        const nodeIndex = nodes.length;

                        nodes.push(new PhysicsNode(currentColor));

                        connectNodes(nodes[nodeIndex], nodes[parentIndex1]);
                        connectNodes(nodes[nodeIndex], nodes[parentIndex2]);

                        prevIndex += 2;
                        break;
                    }

                    default:
                        throw new Error(`Unknown stitch type: ${stitch}`);
                }
            }

            // must consume all parent stitches
            if (prevIndex !== prevRowCount) {
                throw new Error(
                    `Row ${rowCounter}: Expected to consume ${prevRowCount} parent stitches, but consumed ${prevIndex}`
                );
            }
        }

        const currentRowCount = nodes.length - currentRowCountStart;
        
        if (currentRowCount > 1) {
            // connect the first and last stitch of a row
            connectNodes(nodes[currentRowCountStart], nodes[nodes.length - 1]);

            // connect neighbors in same row
            for (let i = 1; i < currentRowCount; i++) {
                connectNodes(nodes[currentRowCountStart + i - 1], nodes[currentRowCountStart + i]);
            }
        }

        // update row trackers
        nodesBeforePrevRow = currentRowCountStart;
        prevRowCount = currentRowCount;
    }

    return { nodes };
}

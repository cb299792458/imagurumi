import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
}

type ParsedLine =
  | { type: "color"; value: string }
  | { type: "row"; stitches: string[] };

function parsePatternLines(pattern: string): ParsedLine[] {
    // 1. Filter out empty lines from the initial split
    const lines = pattern.split('\n').map(l => l.trim()).filter(Boolean);
    const result: ParsedLine[] = [];

    for (const line of lines) {
        // color line (word or hex)
        if (/^([a-zA-Z]+|#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))$/.test(line)) {
            result.push({ type: "color", value: line });
            continue;
        }

        // whether the line matches the form: (something) x number
        const match = line.match(/^\(([^)]+)\)\s*x\s*(\d+)$/i);

        if (match) {
            const group = match[1];
            const count = parseInt(match[2], 10);

            const stitches = group.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

            const expanded: string[] = [];
            for (let i = 0; i < count; i++) {
                expanded.push(...stitches);
            }
            result.push({ type: "row", stitches: expanded });
        } else {
            // already expanded row
            const stitches = line.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            if (stitches.length > 0) {
                result.push({ type: "row", stitches });
            }
        }
    }
    return result;
}
export function createParsedGraph(pattern: string): { nodes: PhysicsNode[]; nodeColors: string[]; } {
    const nodes: PhysicsNode[] = [];
    const nodeColors: string[] = [];

    const parsedLines = parsePatternLines(pattern);

    let prevRowCount = 0;
    let nodesBeforePrevRow = 0;
    let currentColor = "#b3b3b3"; 

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

        // first row: just create nodes
        if (nodes.length === 0) {
            for (let i = 0; i < row.length; i++) {
                nodes.push(new PhysicsNode());
                nodeColors.push(currentColor);
            }
        } 
        // all other rows
        else {
            for (const stitch of row) {
                switch (stitch) {
                    case "sc": {
                        if (prevIndex >= prevRowCount) {
                            throw new Error(`Row ${rowCounter}: Not enough parent stitches`);
                        }
                        const nodeIndex = nodes.length;
                        const parentIndex = nodesBeforePrevRow + prevIndex;

                        nodes.push(new PhysicsNode());
                        nodeColors.push(currentColor);
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

                        nodes.push(new PhysicsNode(), new PhysicsNode());
                        nodeColors.push(currentColor, currentColor);

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

                        nodes.push(new PhysicsNode());
                        nodeColors.push(currentColor);

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

    return { nodes, nodeColors };
}

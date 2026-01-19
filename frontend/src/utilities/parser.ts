import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
}

export const createParsedGraph = (pattern: string): { nodes: PhysicsNode[] } => {
    const nodes: PhysicsNode[] = [];

    const rows = pattern.trim().split('\n').map(row => row.split(',').map(s => s.trim()).filter(Boolean));

    let prevRowCount = 0;
    let nodesBeforePrevRow = 0;

    // handling inc & dec
    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const currentRowCountStart = nodes.length;

        let prevIndex = 0;

        // first row: just create nodes
        if (r === 0) {
            for (let i = 0; i < row.length; i++) {
                nodes.push(new PhysicsNode());
            }
        } 
        // all other rows
        else {
            for (let stitchIndex = 0; stitchIndex < row.length; stitchIndex++) {
                const stitch = row[stitchIndex];

                if (prevIndex >= prevRowCount) {
                    throw new Error(
                        `Row ${r + 1}: Not enough parent stitches`
                    );
                }
                
                switch (stitch) {
                    case "sc": {
                        const nodeIndex = nodes.length;
                        const parentIndex = nodesBeforePrevRow + prevIndex;

                        nodes.push(new PhysicsNode());
                        connectNodes(nodes[nodeIndex], nodes[parentIndex]);

                        prevIndex += 1;
                        break;
                    }

                    case "inc": {
                        const parentIndex = nodesBeforePrevRow + prevIndex;

                        const nodeIndex1 = nodes.length;
                        const nodeIndex2 = nodes.length + 1;

                        nodes.push(new PhysicsNode(), new PhysicsNode());

                        connectNodes(nodes[nodeIndex1], nodes[parentIndex]);
                        connectNodes(nodes[nodeIndex2], nodes[parentIndex]);

                        prevIndex += 1;
                        break;
                    }

                    case "dec": {
                        if (prevIndex + 1 >= prevRowCount) {
                            throw new Error(
                                `Row ${r + 1}: dec requires 2 parent stitches`
                            );
                        }

                        const parentIndex1 = nodesBeforePrevRow + prevIndex;
                        const parentIndex2 = nodesBeforePrevRow + prevIndex + 1;
                        const nodeIndex = nodes.length;

                        nodes.push(new PhysicsNode());

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
                    `Row ${r + 1}: Expected to consume ${prevRowCount} parent stitches, but consumed ${prevIndex}`
                );
            }
        }

        const currentRowCount = nodes.length - currentRowCountStart;

        // connect the first and last stitch of a row
        if (currentRowCount > 1) {
            const first = currentRowCountStart;
            const last = currentRowCountStart + currentRowCount - 1;

            connectNodes(nodes[first], nodes[last]);

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
};

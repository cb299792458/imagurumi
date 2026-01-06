import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";

import styles from '../../components/ThreeCanvas.module.css';
import GraphSimulation from "./GraphSimulation";
import { PhysicsEdge, PhysicsNode } from "./TestClasses";
import { createParsedGraph } from "../../utilities/parser";

const createClosedCylinderGraph = () => {
    const CIRCUMFERENCE = 12
    const HEIGHT = 5

    const nodes: PhysicsNode[] = [];
    const edges: PhysicsEdge[] = [];

    for (let i = 0; i < CIRCUMFERENCE; i++) {
        for (let j = 0; j < HEIGHT; j++) {
          nodes.push(new PhysicsNode());
        }
    }

    // connect grid edges
    for (let i = 0; i < CIRCUMFERENCE; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            const idx = i * HEIGHT + j;
            if (i > 0) edges.push(new PhysicsEdge(idx, idx - HEIGHT));
            if (j > 0) edges.push(new PhysicsEdge(idx, idx - 1));
        }
    }

    // roll into cylinder
    for (let i = 0; i < HEIGHT; i++) {
        const idx1 = i;
        const idx2 = (HEIGHT) * (CIRCUMFERENCE-1) + i
        edges.push(new PhysicsEdge(idx1, idx2)); // connect first and last in each row
    }

    // hardcode end
    for (let i = 0; i < 6; i++) {
        nodes.push(new PhysicsNode());
        const idx1 = nodes.length-1;
        const idx2 = 2 * HEIGHT * i
        edges.push(new PhysicsEdge(idx1, idx2))
    }

    for (let i = 0; i < 5; i ++) {
        edges.push(new PhysicsEdge(nodes.length - 6 + i, nodes.length - 6 + i + 1))
    }

    edges.push(new PhysicsEdge(nodes.length - 1, nodes.length - 6))

    return { nodes, edges };
}

const createSimpleMeshGraph = () => {
    const SIZE = 10;

    const nodes: PhysicsNode[] = [];
    const edges: PhysicsEdge[] = [];

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            nodes.push(new PhysicsNode())
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        if (i % SIZE > 0) { // connect rows
            edges.push(new PhysicsEdge(i, i - 1))
        }
        if (i >= SIZE) { // connect columns
            edges.push(new PhysicsEdge(i, i - SIZE))
        }
    }

    return { nodes, edges }
}

const createCrochetSphereGraph = () => {
    /*
        A replication of this pattern:
        const text1 = 
        `!color #white [0]
        !mr 6sc [6]
        (inc)x6 [12]
        (1sc,inc)x6 [18]
        (2sc,inc)x6 [24]
        24sc [24]
        24sc [24]
        24sc [24]
        24sc [24]
        24sc [24]
        (2sc,dec)x6 [18]
        (1sc,dec)x6 [12]
        (dec)x6 [6]
        !cut-fill-close [0]`
    */
    const ROWS = [6, 12, 18, 24, 24, 24, 24, 24, 24, 18, 12, 6];

    const nodes: PhysicsNode[] = [];
    const edges: PhysicsEdge[] = [];

    // this is why Jeongwon will need to code a text parser =)
    for (const [i, count] of ROWS.entries()) {
        for (let j = 0; j < count; j++) {
            // the last node will always be nodes[nodes.length - 1]
            nodes.push(new PhysicsNode());

            if (j > 0) { // connect within row
                edges.push(new PhysicsEdge(nodes.length - 2, nodes.length - 1));
            }

            // 싫어요 
            switch (i) {
                case 0:
                    break;
                case 1:
                    edges.push(new PhysicsEdge(nodes.length - 1, Math.floor(j/2)))
                    break;
                case 2:
                    edges.push(new PhysicsEdge(nodes.length - 1, 6 + Math.floor((2 * j + 1) / 3)))
                    break;
                case 3:
                    edges.push(new PhysicsEdge(nodes.length - 1, 18 + Math.floor((3 * j + 2) / 4)))
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    // connect last node to corresponding node in prev row
                    edges.push(new PhysicsEdge(nodes.length - 1, nodes.length - 25))
                    break;
                case 9:
                    // massive trial and error but looks ok now
                    edges.push(new PhysicsEdge(nodes.length - 1, 156 + Math.floor((4 * j) / 3)))
                    if (j % 3 === 2) {
                        edges.push(new PhysicsEdge(nodes.length - 1, 156 + Math.floor((4 * j) / 3) + 1))
                    }
                    break;
                case 10:
                    edges.push(new PhysicsEdge(nodes.length - 1, 180 + Math.floor((3 * j) / 2)));
                    if (j % 2 == 1) {
                        edges.push(new PhysicsEdge(nodes.length - 1, 180 + Math.floor((3 * j) / 2) + 1));
                    }
                    break;
                case 11:
                    edges.push(new PhysicsEdge(nodes.length - 1, 198 + (2 * j)));
                    edges.push(new PhysicsEdge(nodes.length - 1, 198 + (2 * j) + 1));
                    break;
                default:
                    break
            }
        }

        edges.push(new PhysicsEdge(nodes.length - 1, nodes.length - count)) // connect first and last in row
    }


    return { nodes, edges }
}



const defaultSpherePattern = `sc,sc,sc,sc,sc,sc
inc,inc,inc,inc,inc,inc
sc,inc,sc,inc,sc,inc,sc,inc,sc,inc,sc,inc
sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
sc,dec,sc,dec,sc,dec,sc,dec,sc,dec,sc,dec
dec,dec,dec,dec,dec,dec`;


export default function TestPage() {
    const [textInput, setTextInput] = useState(defaultSpherePattern);
    const [demoVersion, setDemoVersion] = useState<string>('clear')
    const [patternText, setPatternText] = useState(defaultSpherePattern);
    const [error, setError] = useState<string | null>(null);

    const options = useMemo<Record<
        string,
        () => { nodes: PhysicsNode[]; edges: PhysicsEdge[] }
    >>(() => ({
        clear: () => ({ nodes: [], edges: [] }),
        mesh: createSimpleMeshGraph,
        cylinder: createClosedCylinderGraph,
        sphere: createCrochetSphereGraph,
        pattern: () => createParsedGraph(patternText),
    }), [patternText]);

    const { nodes, edges } = useMemo(() => {
        try {
            setError(null);
            return options[demoVersion]();
        } catch (e: any) {
            setError(e.message || "Unknown pattern error");
            return { nodes: [], edges: [] };
        }
    }, [demoVersion, options]);
    return (
        <div className={styles.canvasContainer}>
            <div>
                {Object.keys(options).map((key) => {
                    return <button onClick={() => setDemoVersion(key)} key={key}>
                        {key}
                    </button>
                })}
            </div>
            <div>
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={15}
                    cols={30}
                />
                <button onClick={() => {setPatternText(textInput); setDemoVersion('pattern')}}>Generate</button>
                {error && (
                    <div style={{ color: "red", whiteSpace: "pre-wrap" }}>
                        {error}
                    </div>
                )}
            </div>
            <div className={styles.canvasControls}>
                🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
            </div>
            <Canvas camera={{ position: [10, 10, 10] }}>
                <ambientLight />
                <OrbitControls />
                <GraphSimulation nodes={nodes} edges={edges} />
            </Canvas>
        </div>
    );
}

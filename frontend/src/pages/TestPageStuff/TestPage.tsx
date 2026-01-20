import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";

import styles from './TestPage.module.css';
import sharedStyles from '../../styles/components.module.css';
import GraphSimulation from "./GraphSimulation";
import { PhysicsNode } from "./TestClasses";
import { createParsedGraph } from "../../utilities/parser";

function connectNodes(n1: PhysicsNode, n2: PhysicsNode) {
    if (!n1.neighbors.includes(n2)) n1.neighbors.push(n2);
    if (!n2.neighbors.includes(n1)) n2.neighbors.push(n1);
}

const createClosedCylinderGraph = () => {
    const CIRCUMFERENCE = 12
    const HEIGHT = 5

    const nodes: PhysicsNode[] = [];

    for (let i = 0; i < CIRCUMFERENCE; i++) {
        for (let j = 0; j < HEIGHT; j++) {
          nodes.push(new PhysicsNode());
        }
    }

    // connect grid edges
    for (let i = 0; i < CIRCUMFERENCE; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            const idx = i * HEIGHT + j;
            if (i > 0) connectNodes(nodes[idx], nodes[idx - HEIGHT]);
            if (j > 0) connectNodes(nodes[idx], nodes[idx - 1]);
        }
    }

    // roll into cylinder
    for (let i = 0; i < HEIGHT; i++) {
        const idx1 = i;
        const idx2 = (HEIGHT) * (CIRCUMFERENCE-1) + i
        connectNodes(nodes[idx1], nodes[idx2]); // connect first and last in each row
    }

    // hardcode end
    for (let i = 0; i < 6; i++) {
        nodes.push(new PhysicsNode());
        const idx1 = nodes.length-1;
        const idx2 = 2 * HEIGHT * i
        connectNodes(nodes[idx1], nodes[idx2])
    }

    for (let i = 0; i < 5; i ++) {
        connectNodes(nodes[nodes.length - 6 + i], nodes[nodes.length - 6 + i + 1])
    }

    connectNodes(nodes[nodes.length - 1], nodes[nodes.length - 6])

    return { nodes };
}

const createSimpleMeshGraph = () => {
    const SIZE = 10;

    const nodes: PhysicsNode[] = [];

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            nodes.push(new PhysicsNode())
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        if (i % SIZE > 0) { // connect rows
            connectNodes(nodes[i], nodes[i - 1])
        }
        if (i >= SIZE) { // connect columns
            connectNodes(nodes[i], nodes[i - SIZE])
        }
    }

    return { nodes }
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

    // this is why Jeongwon will need to code a text parser =)
    for (const [i, count] of ROWS.entries()) {
        for (let j = 0; j < count; j++) {
            // the last node will always be nodes[nodes.length - 1]
            nodes.push(new PhysicsNode());

            if (j > 0) { // connect within row
                connectNodes(nodes[nodes.length - 2], nodes[nodes.length - 1]);
            }

            // 싫어요 
            switch (i) {
                case 0:
                    break;
                case 1:
                    connectNodes(nodes[nodes.length - 1], nodes[Math.floor(j/2)])
                    break;
                case 2:
                    connectNodes(nodes[nodes.length - 1], nodes[6 + Math.floor((2 * j + 1) / 3)])
                    break;
                case 3:
                    connectNodes(nodes[nodes.length - 1], nodes[18 + Math.floor((3 * j + 2) / 4)])
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    // connect last node to corresponding node in prev row
                    connectNodes(nodes[nodes.length - 1], nodes[nodes.length - 25])
                    break;
                case 9:
                    // massive trial and error but looks ok now
                    connectNodes(nodes[nodes.length - 1], nodes[156 + Math.floor((4 * j) / 3)])
                    if (j % 3 === 2) {
                        connectNodes(nodes[nodes.length - 1], nodes[156 + Math.floor((4 * j) / 3) + 1])
                    }
                    break;
                case 10:
                    connectNodes(nodes[nodes.length - 1], nodes[180 + Math.floor((3 * j) / 2)]);
                    if (j % 2 == 1) {
                        connectNodes(nodes[nodes.length - 1], nodes[180 + Math.floor((3 * j) / 2) + 1]);
                    }
                    break;
                case 11:
                    connectNodes(nodes[nodes.length - 1], nodes[198 + (2 * j)]);
                    connectNodes(nodes[nodes.length - 1], nodes[198 + (2 * j) + 1]);
                    break;
                default:
                    break
            }
        }

        connectNodes(nodes[nodes.length - 1], nodes[nodes.length - count]) // connect first and last in row
    }


    return { nodes }
}



// const defaultSpherePattern = `sc,sc,sc,sc,sc,sc
// inc,inc,inc,inc,inc,inc
// sc,inc,sc,inc,sc,inc,sc,inc,sc,inc,sc,inc
// sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
// sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
// sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc
// sc,dec,sc,dec,sc,dec,sc,dec,sc,dec,sc,dec
// dec,dec,dec,dec,dec,dec`;

const defaultSpherePattern = `purple
(sc) x 6
(inc) x 6
(sc, inc) x 6

#eeb2e4
(sc) x 18
(sc) x 18
(sc) x 18

#8ee5fd
(sc, dec) x 6
(dec) x 6`;



export default function TestPage() {
    const [textInput, setTextInput] = useState(defaultSpherePattern);
    const [demoVersion, setDemoVersion] = useState<string>('mesh')
    const [patternText, setPatternText] = useState(defaultSpherePattern);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const options = useMemo<Record<string, () => { nodes: PhysicsNode[]; nodeColors?: string[] }>>(
        () => ({
            mesh: () => ({ nodes: createSimpleMeshGraph().nodes }),
            cylinder: () => ({ nodes: createClosedCylinderGraph().nodes }),
            sphere: () => ({ nodes: createCrochetSphereGraph().nodes }),
            pattern: () => createParsedGraph(patternText),
        }),
        [patternText]
    );

    const { nodes, nodeColors = [] } = useMemo(() => {
        try {
            setError(null);
            return options[demoVersion]();
        } catch (e: any) {
            setError(e.message || "Unknown pattern error");
            return { nodes: [], nodeColors: [] };
        }
    }, [demoVersion, options]);

    const handleSelectDemo = (key: string) => {
        setDemoVersion(key);
        setIsModalOpen(true);
    };

    const handleGenerate = () => {
        setPatternText(textInput);
        setDemoVersion('pattern');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className={styles.buttonGroup}>
                    {Object.keys(options).map((key) => {
                        return (
                            <button 
                                onClick={() => handleSelectDemo(key)} 
                                key={key}
                                className={styles.button}
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
                <div className={styles.inputSection}>
                    <label htmlFor="pattern-input" className={sharedStyles.formLabel}>
                        Pattern Text
                    </label>
                    <textarea
                        id="pattern-input"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={15}
                        cols={30}
                        className={styles.textarea}
                    />
                    <button onClick={handleGenerate} className={styles.generateButton}>
                        Generate
                    </button>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Simulation Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>3D Simulation</h2>
                            <button 
                                onClick={closeModal}
                                className={styles.modalCloseButton}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.canvasContainer}>
                                <div className={styles.canvasControls}>
                                    🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
                                </div>
                                <Canvas camera={{ position: [10, 10, 10] }}>
                                    <ambientLight />
                                    <OrbitControls />
                                    <GraphSimulation nodes={nodes} nodeColors={nodeColors} />
                                </Canvas>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

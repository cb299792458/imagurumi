import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { CreateNewPatternForm } from '../components/CreateNewPatternForm';
import { PhysicsPatternView } from '../components/PhysicsPatternView';
import { PhysicsNode } from '../pages/TestPageStuff/TestClasses';
import { createParsedGraph } from '../utilities/parser';
import styles from './PatternPage.module.css';

const NewPatternPage: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [nodes, setNodes] = useState<PhysicsNode[]>([]);
    const [parseError, setParseError] = useState<string>('');

    // Parse text and create nodes whenever text changes
    useEffect(() => {
        if (!text.trim()) {
            setNodes([]);
            setParseError('');
            return;
        }

        try {
            const { nodes: parsedNodes } = createParsedGraph(text);
            setNodes(parsedNodes);
            setParseError('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error parsing pattern';
            setParseError(errorMessage);
            setNodes([]);
        }
    }, [text]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>New Pattern Creator</h1>
                    <p className={styles.subtitle}>
                        Create a new pattern with points
                    </p>
                </div>

                {parseError && (
                    <div className={styles.errorMessage}>
                        {parseError}
                    </div>
                )}

                <div className={styles.mainContent}>
                    <div className={styles.leftPanel}>
                        <CreateNewPatternForm text={text} nodes={nodes} />
                    </div>
                    
                    {/* Center Panel - Pattern Text Input */}
                    <div className={styles.centerPanel}>
                        <div className={styles.patternInput}>
                            <label htmlFor="pattern-text" className={styles.inputLabel}>
                                Pattern Text
                            </label>
                            <textarea
                                id="pattern-text"
                                className={styles.textarea}
                                placeholder="Type or paste your pattern text here..."
                                rows={8}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Panel - 3D View */}
                    <div className={styles.rightPanel}>
                        <h3 className={styles.inputLabel}>3D Preview</h3>
                        <div className={styles.threeCanvasContainer}>
                            {nodes.length > 0 ? (
                                <PhysicsPatternView nodes={nodes} />
                            ) : (
                                <div className={styles.canvasPlaceholder}>
                                    Add pattern text to see the 3D preview
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NewPatternPage;

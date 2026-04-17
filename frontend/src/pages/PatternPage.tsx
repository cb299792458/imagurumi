import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Layout from './Layout';
import { CreatePatternForm } from '../components/CreatePatternForm';
import { PhysicsPatternView } from '../components/PhysicsPatternView';
import { PhysicsNode } from '../pages/TestPageStuff/TestClasses';
import { createParsedGraph } from '../utilities/parser';
import { toggleCommentAtSelection } from '../utilities/patternTextComments';
import { SAMPLE_PATTERNS } from '../data/samplePatterns';
import styles from './PatternPage.module.css';

function normalizeSampleTextForEditor(text: string): string {
    return text
        .replace(/\t+/g, '')
        .split('\n')
        .map((line) => line.trimStart())
        .join('\n');
}

const PatternPage: React.FC = () => {
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

    const handleSamplePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (!id) {
            return;
        }
        const sample = SAMPLE_PATTERNS.find((p) => p.id === id);
        if (!sample) {
            return;
        }
        setText(normalizeSampleTextForEditor(sample.text));
        // Reset to placeholder so the same sample can be loaded again.
        e.currentTarget.value = '';
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Pattern</h1>
                    <p className={styles.subtitle}>
                        Create a pattern with points
                    </p>
                </div>

                {parseError && (
                    <div className={styles.errorMessage}>
                        {parseError}
                    </div>
                )}

                <div className={styles.mainContent}>
                    <div className={styles.leftPanel}>
                        <CreatePatternForm text={text} nodes={nodes} />
                    </div>

                    {/* Center Panel - Pattern Text Input */}
                    <div className={styles.centerPanel}>
                        <div className={styles.patternInput}>
                            <div className={styles.patternInputHeader}>
                                <label htmlFor="pattern-text" className={styles.inputLabel}>
                                    Pattern Text
                                </label>
                                <div className={styles.samplePatternTools}>
                                    <label htmlFor="sample-pattern-select" className="sr-only">
                                        Load a sample pattern into the editor
                                    </label>
                                    <select
                                        id="sample-pattern-select"
                                        className={styles.sampleSelect}
                                        onChange={handleSamplePatternChange}
                                        aria-label="Sample patterns"
                                    >
                                        <option value="">Sample patterns…</option>
                                        {SAMPLE_PATTERNS.map((sample) => (
                                            <option key={sample.id} value={sample.id}>
                                                {sample.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <textarea
                                id="pattern-text"
                                className={styles.textarea}
                                placeholder="Type or paste your pattern text here..."
                                rows={8}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key !== '/' || (!e.metaKey && !e.ctrlKey)) {
                                        return;
                                    }
                                    e.preventDefault();
                                    const ta = e.currentTarget;
                                    const { value, selectionStart, selectionEnd } = ta;
                                    const next = toggleCommentAtSelection(
                                        value,
                                        selectionStart,
                                        selectionEnd
                                    );
                                    flushSync(() => {
                                        setText(next.text);
                                    });
                                    ta.setSelectionRange(next.selectionStart, next.selectionEnd);
                                }}
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

export default PatternPage;

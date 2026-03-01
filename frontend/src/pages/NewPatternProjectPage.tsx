import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_NEW_PATTERNS } from "../utilities/gql";
import { Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import { PatternTransformer } from "../components/PatternTransformer";
import { CreateNewProjectForm } from "../components/CreateNewProjectForm";
import Layout from "./Layout";
import { newPatternsToProject } from "../utilities/converters";
import styles from "./NewProjectPage.module.css";

interface NewPatternFromApi {
    id: number;
    name: string;
    description: string | null;
    text: string;
    userId: number;
    createdAt: string | number;
    points: Array<{ id: number; x: number; y: number; z: number; color: string }>;
}

const NewPatternProjectPage = () => {
    const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_NEW_PATTERNS);
    const [newPatterns, setNewPatterns] = useState<NewPatternFromApi[]>([]);
    const [project, setProject] = useState<Project>([]);
    const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);
    const [showProTip, setShowProTip] = useState<boolean>(true);

    useEffect(() => {
        setProject((prev) => newPatternsToProject(prev, newPatterns));
    }, [newPatterns]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create a New Pattern Project</h1>
                    <p className={styles.subtitle}>
                        Build 3D projects by combining and transforming your saved new patterns
                    </p>
                </div>

                <div className={styles.tablesGrid}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Add New Patterns</h2>
                        <p className={styles.sectionDescription}>
                            Choose new patterns from the list below to add to your project.
                        </p>
                        <div className={styles.tableScroll}>
                            <table className={styles.patternsTable}>
                                <thead>
                                    <tr>
                                        <th>Pattern ID</th>
                                        <th>Pattern Name</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patternLoading && (
                                        <tr>
                                            <td colSpan={4} className={styles.loadingRow}>
                                                Loading patterns...
                                            </td>
                                        </tr>
                                    )}
                                    {patternError && (
                                        <tr>
                                            <td colSpan={4} className={styles.errorRow}>
                                                Error: {patternError.message}
                                            </td>
                                        </tr>
                                    )}
                                    {patternData?.allNewPatterns.map((pattern: NewPatternFromApi) => (
                                        <tr key={pattern.id}>
                                            <td>{pattern.id}</td>
                                            <td>{pattern.name}</td>
                                            <td>{pattern.description ?? ""}</td>
                                            <td>
                                                <button
                                                    onClick={() => setNewPatterns([...newPatterns, pattern])}
                                                    className={styles.addPatternButton}
                                                >
                                                    Add to Project
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Project Patterns</h2>
                        {showProTip && (
                            <div className={styles.patternsInfo}>
                                <button
                                    type="button"
                                    aria-label="Dismiss tips"
                                    className={styles.dismissTip}
                                    onClick={() => setShowProTip(false)}
                                >
                                    ×
                                </button>
                                <strong>💡 Pro Tips:</strong> Click on a pattern to select it. Use the transformations to modify the pattern.
                                Patterns can be moved along the X (red), Y (green), or Z (blue) axes. Rotations are counter-clockwise around the indicated axis.
                            </div>
                        )}
                        <div className={styles.tableScroll}>
                            <table className={styles.patternsTable}>
                                <thead>
                                    <tr>
                                        <th>Pattern ID</th>
                                        <th>Pattern Name</th>
                                        <th>Transformations</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newPatterns.map((pattern: NewPatternFromApi, index: number) => (
                                        <tr
                                            key={index}
                                            className={selectedPatternIndex === index ? styles.selected : ""}
                                            onClick={() => setSelectedPatternIndex(index)}
                                        >
                                            <td>{pattern.id}</td>
                                            <td>{pattern.name}</td>
                                            <td>
                                                <PatternTransformer index={index} project={project} setProject={setProject} />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={(e) => {
                                                        setNewPatterns(newPatterns.filter((_, i) => i !== index));
                                                        setSelectedPatternIndex(-1);
                                                        e.stopPropagation();
                                                    }}
                                                    className={styles.removePatternButton}
                                                >
                                                    Remove Pattern
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <div className={styles.canvasGrid}>
                    <div className={styles.threeCanvasContainer}>
                        {project.length > 0 ? (
                            <ThreeCanvas project={project} />
                        ) : (
                            <div className={styles.canvasPlaceholder}>
                                Add some new patterns to your project to see the 3D preview
                            </div>
                        )}
                    </div>
                    <CreateNewProjectForm project={project} newPatternIds={newPatterns.map((np) => np.id)} />
                </div>
            </div>
        </Layout>
    );
};

export default NewPatternProjectPage;

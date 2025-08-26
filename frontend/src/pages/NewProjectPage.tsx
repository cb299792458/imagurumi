import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PATTERNS } from "../utilities/gql";
import { PatternRecord, Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import { PatternTransformer } from "../components/PatternTransformer";
import { CreateProjectForm } from "../components/CreateProjectForm";
import Layout from "./Layout";
import { patternRecordsToProject } from "../utilities/converters";
import styles from './NewProjectPage.module.css';

const NewProjectPage = () => {
    const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_PATTERNS);
    const [patterns, setPatterns] = useState<PatternRecord[]>([]);
    const [project, setProject] = useState<Project>([]);
    const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);

    // load a new pattern into project
    useEffect(() => {
        setProject(patternRecordsToProject(project, patterns));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patterns]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create a New Project</h1>
                    <p className={styles.subtitle}>
                        Build amazing 3D projects by combining and transforming patterns
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Add Patterns</h2>
                    <p className={styles.sectionDescription}>
                        Choose patterns from the list below to add to your project.
                    </p>
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
                            {patternData?.allPatterns.map((pattern: PatternRecord) => (
                                <tr key={pattern.id}>
                                    <td>{pattern.id}</td>
                                    <td>{pattern.name}</td>
                                    <td>{pattern.description}</td>
                                    <td>
                                        <button 
                                            onClick={() => setPatterns([...patterns, pattern])}
                                            className={styles.addPatternButton}
                                        >
                                            Add to Project
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Project Patterns</h2>
                    <div className={styles.patternsInfo}>
                        <strong>💡 Pro Tips:</strong> Click on a pattern to select it. Use the transformations to modify the pattern. 
                        Patterns can be moved along the X (red), Y (green), or Z (blue) axes. Rotations are counter-clockwise around the indicated axis.
                    </div>
                    <table className={styles.patternsTable}>
                        <thead>
                            <tr>
                                <th>Pattern ID</th>
                                <th>Pattern Name</th>
                                <th>Transformations</th>
                                <th>Remove Pattern</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patterns.map((pattern: PatternRecord, index: number) => (
                                <tr 
                                    key={index} 
                                    className={selectedPatternIndex === index ? styles.selected : ''}
                                    onClick={() => setSelectedPatternIndex(index)}
                                >
                                    <td>{pattern.id}</td>
                                    <td>{pattern.name}</td>
                                    <td>
                                        <PatternTransformer index={index} project={project} setProject={setProject}/>
                                    </td>                      
                                    <td>
                                        <button 
                                            onClick={(e) => {
                                                setPatterns(patterns.filter((_, i) => i !== index)); 
                                                setSelectedPatternIndex(-1); 
                                                e.stopPropagation();
                                            }}
                                            className={styles.removePatternButton}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <div className={styles.threeCanvasContainer}>
                    {project.length > 0 ? (
                        <ThreeCanvas project={project} />
                    ) : (
                        <div className={styles.canvasPlaceholder}>
                            Add some patterns to your project to see the 3D preview
                        </div>
                    )}
                </div>

                <CreateProjectForm project={project} />
            </div>
        </Layout>
    );
}

export default NewProjectPage;

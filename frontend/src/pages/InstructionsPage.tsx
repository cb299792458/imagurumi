import { useParams } from "react-router-dom";
import Layout from "./Layout"
import { useQuery } from "@apollo/client";
import { GET_PATTERNS, GET_PROJECT } from "../utilities/gql";
import { useEffect, useState } from "react";
import { ProjectPattern, ProjectPatternRecord } from "../utilities/types";
import { textToPatternInstance } from "../utilities/converters";
import styles from './InstructionsPage.module.css';

const InstructionsPage = () => {
    const [ projectName, setProjectName ] = useState<string>('');
    const [ projectDescription, setProjectDescription ] = useState<string>('');
    const [ instructions, setInstructions ] = useState<string[]>([]);
    const [ loadingIndex, setLoadingIndex ] = useState<number>(0);
    const { type, id } = useParams<{ type: string, id: string }>();
    const projectId = id ? parseInt(id, 10) : null;
    const isProjectQuery = type === 'project';
    const { loading, error, data } = useQuery(
        isProjectQuery ? GET_PROJECT : GET_PATTERNS,
        {
            variables: isProjectQuery ? { id: projectId } : undefined,
            skip: isProjectQuery && (!projectId || isNaN(projectId))
        }
    )

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingIndex((prevIndex) => (prevIndex + 1) % 3);
            }, 500);
            return () => clearInterval(interval);
        } else {
            setLoadingIndex(0);
        }
    }, [loading]);

    useEffect(() => {
        if (data?.project) {
            const { project } = data;
            const { name, description } = project;
            setProjectName(name);
            setProjectDescription(description);

            const projectPatterns: Record<number, ProjectPattern> = project.projectPatterns.reduce(
                (acc: Record<number, ProjectPattern>, projectPatternRecord: ProjectPatternRecord) => {
                    const { pattern } = projectPatternRecord;
                    const { id, name, text } = pattern;
                    const count = acc[id]?.count || 0;
                    acc[id] = {
                        id,
                        name,
                        text,
                        count: count + 1
                    }
                    return acc;
                }, {}
            );
            
            setInstructions(Object.values(projectPatterns).reduce((acc: string[], pattern: ProjectPattern) => {
                const { name, text, count } = pattern;
                const patternInstance = textToPatternInstance(text);
                return [...acc, `${count > 1 ? name + ' x ' + count + '\n' : name + '\n'}\n` + patternInstance.toString() + '\n'];
            }, []));
        }
    }, [data]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <a href={`/project/${id}`} className={styles.backLink}>
                        ← Back to Project
                    </a>
                    <h1 className={styles.title}>Instructions</h1>
                    {projectName && <h2 className={styles.projectName}>{projectName}</h2>}
                    {projectDescription && <p className={styles.projectDescription}>{projectDescription}</p>}
                </div>

                {loading && (
                    <p className={styles.loadingText}>
                        Loading instructions{['.', '..', '...'][loadingIndex]}
                    </p>
                )}
                
                {error && (
                    <p className={styles.errorText}>
                        Error: {error.message}
                    </p>
                )}
                
                {instructions?.map((piece, i) => (
                    <section key={i} className={styles.instructionsSection}>
                        {piece.split('\n').map((line, j) => (
                            <p key={j} className={styles.instructionLine}>
                                {line}
                            </p>
                        ))}
                    </section>
                ))}
            </div>
        </Layout>
    )
}

export default InstructionsPage;

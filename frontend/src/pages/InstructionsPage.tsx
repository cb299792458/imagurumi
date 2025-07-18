import { useParams } from "react-router-dom";
import Layout from "./Layout"
import { useQuery } from "@apollo/client";
import { GET_PATTERNS, GET_PROJECT } from "../utilities/gql";
import { useEffect, useState } from "react";
import { ProjectPattern, ProjectPatternRecord } from "../utilities/types";
import { textToPatternInstance } from "../utilities/converters";

const InstructionsPage = () => {
    const [ projectName, setProjectName ] = useState<string>('');
    const [ projectDescription, setProjectDescription ] = useState<string>('');
    const [ instructions, setInstructions ] = useState<string[]>([]);
    const [ loadingIndex, setLoadingIndex ] = useState<number>(0);
    const { type, id } = useParams<{ type: string, id: string }>();
    const { loading, error, data } = useQuery(
        type === 'project' ? GET_PROJECT: GET_PATTERNS,
        {variables: { id: parseInt(id || '') }}
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

    return <Layout>
        <a href={`/project/${id}`}>View Project</a>
        <h1>Instructions</h1>
        {projectName && <h2>{projectName}</h2>}
        {projectDescription && <p>{projectDescription}</p>}
        {loading && <p>Loading instructions{['.', '..', '...'][loadingIndex]}</p>}
        {error && <p>Error: {error.message}</p>}
        {instructions?.map((piece, i) => (
            <section key={i} style={{ marginBottom: '1em' }}>
                {piece.split('\n').map((line, j) => (
                    <p key={j} style={{ margin: 0 }}>
                        {line}
                    </p>
                ))}
            </section>
        ))}
    </Layout>
}

export default InstructionsPage;

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PATTERNS } from "../utilities/gql";
import { PatternRecord, Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import { PatternTransformer } from "../components/PatternTransformer";
import { CreateProjectForm } from "../components/CreateProjectForm";
import Layout from "./Layout";
import { patternRecordsToProject } from "../utilities/converters";

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
            <h1>Create a New Project</h1>

            <h2>Add a Pattern</h2>
            <p>Choose patterns from the list below to add to your project.</p>
            <table>
                <thead>
                    <tr>
                        <th>Pattern ID</th>
                        <th>Pattern Name</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {patternLoading && <tr><td colSpan={4}>Loading...</td></tr>}
                    {patternError && <tr><td colSpan={4}>Error: {patternError.message}</td></tr>}
                    {patternData?.allPatterns.map((pattern: PatternRecord) => (
                        <tr key={pattern.id}>
                            <td>{pattern.id}</td>
                            <td>{pattern.name}</td>
                            <td>{pattern.description}</td>
                            <td><button onClick={() => setPatterns([...patterns, pattern])}>Add Pattern to Project</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Current Patterns in Project</h2>
            <p>Click on a pattern to select it. Use the transformations to modify the pattern. Click "Remove" to delete a pattern from the project.</p>
            <p>Patterns can be moved along the X (red), Y (green), or Z (blue) axes. Rotations are counter-clockwise around the indicated axis. </p>
            <table>
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
                        <tr key={index} style={{ fontWeight: selectedPatternIndex === index ? 'bold' : 'normal' }} onClick={() => setSelectedPatternIndex(index)}>
                            <td>{pattern.id}</td>
                            <td>{pattern.name}</td>
                            <td>
                                <PatternTransformer index={index} project={project} setProject={setProject}/>
                            </td>                      
                            <td>
                                <button onClick={(e) => {setPatterns(patterns.filter((_, i) => i !== index)); setSelectedPatternIndex(-1); e.stopPropagation()}}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ThreeCanvas project={project} />
            <CreateProjectForm project={project} />
        </Layout>
    );
}

export default NewProjectPage;

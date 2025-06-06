import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { GET_PATTERNS } from "../utilities/gql";
import { PatternRecord, Project } from "../utilities/types";
import { Pattern } from "../utilities/Pattern";
import { ThreeCanvas } from "../components/ThreeCanvas";
import { PatternTransformer } from "../components/PatternTransformer";
import { CreateProjectForm } from "../components/CreateProjectForm";

const patternRecordsToProject = (prev: Project, patterns: PatternRecord[]): Project => {
    return patterns.map((pattern: PatternRecord, i: number) => {
        const existing = prev[i];
        const patternInstance = new Pattern(pattern.text);
        const patternPoints = patternInstance.toPatternPoints();

        return {
            patternId: pattern.id,
            patternPoints,
            transform: existing?.transform || {
                x: 0,
                y: 0,
                z: 0,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
            },
        };
    })
}

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
        <>
            <NavBar />
            <h1>Create a New Project</h1>
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

            <table>
                <thead>
                    <tr>
                        <th>Pattern ID</th>
                        <th>Index</th>
                        <th>Pattern Name</th>
                    </tr>
                </thead>
                <tbody>
                    {patterns.map((pattern: PatternRecord, index: number) => (
                        <tr key={index} style={{ fontWeight: selectedPatternIndex === index ? 'bold' : 'normal' }} onClick={() => setSelectedPatternIndex(index)}>
                            <td>{pattern.id}</td>
                            <td>{index+1}</td>
                            <td>{pattern.name}</td>
                            <td>
                                <button onClick={(e) => {setPatterns(patterns.filter((_, i) => i !== index)); setSelectedPatternIndex(-1); e.stopPropagation()}}>
                                    Remove
                                </button>
                            </td>
                            <td>
                                <PatternTransformer index={index} project={project} setProject={setProject}/>
                            </td>                      
                        </tr>
                    ))}
                </tbody>
            </table>

            <ThreeCanvas project={project} />
            <CreateProjectForm project={project} />
        </>
    );
}

export default NewProjectPage;

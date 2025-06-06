import { useState } from "react";
import { Project } from "../utilities/types";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../utilities/gql";

export const CreateProjectForm = ({ project }: { project: Project }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userId = 1; // TODO: get userId from context or props
  
    const [createProject, { data, loading, error }] = useMutation(CREATE_PROJECT);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const projectPatterns = project.map((p) => ({patternId: p.patternId, ...p.transform}));
        await createProject({ variables: { name, description, userId, projectPatterns }});
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button type="submit">Save Project</button>
    
            {loading && <p>Submitting...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Created pattern: {data.createProject.name}</p>}
        </form>
    );
}

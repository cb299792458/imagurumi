import { useState } from "react";
import { Project } from "../utilities/types";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../utilities/gql";
import styles from './CreateProjectForm.module.css';
import sharedStyles from '../styles/components.module.css';

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
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Save Project</h2>
            <p className={styles.description}>
                Add a name and description, then save your project. Your project will be viewable in the All Projects page.
            </p>
            
            <div className={sharedStyles.formGroup}>
                <label htmlFor="project-name" className={sharedStyles.formLabel}>Project Name</label>
                <input 
                    id="project-name"
                    type="text"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter project name" 
                    required 
                    className={sharedStyles.formInput}
                />
            </div>
            
            <div className={sharedStyles.formGroup}>
                <label htmlFor="project-description" className={sharedStyles.formLabel}>Description</label>
                <textarea 
                    id="project-description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe your project" 
                    className={sharedStyles.formTextarea}
                />
            </div>
            
            <button type="submit" className={styles.submitButton}>
                💾 Save Project
            </button>
    
            {loading && <p className={styles.loadingText}>Saving project...</p>}
            {error && <p className={styles.errorText}>Error: {error.message}</p>}
            {data && <p className={styles.successText}>Project saved: {data.createProject.name}</p>}
        </form>
    );
}

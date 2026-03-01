import { useState } from "react";
import { Project } from "../utilities/types";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_PROJECT } from "../utilities/gql";
import styles from './CreateProjectForm.module.css';
import sharedStyles from '../styles/components.module.css';

export const CreateNewProjectForm = ({
    project,
    newPatternIds,
}: {
    project: Project;
    newPatternIds: number[];
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const userId = 1; // TODO: get userId from context or props

    const [createNewProject, { data, loading, error }] = useMutation(CREATE_NEW_PROJECT);

    const toFloat = (v: unknown): number => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!name.trim()) {
            setShowErrors(true);
            return;
        }
        const defaultTransform = { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };
        const newProjectPatterns = newPatternIds.map((newPatternId, i) => {
            const t = project[i]?.transform ?? defaultTransform;
            return {
                newPatternId,
                x: toFloat(t.x),
                y: toFloat(t.y),
                z: toFloat(t.z),
                rotX: toFloat(t.rotX),
                rotY: toFloat(t.rotY),
                rotZ: toFloat(t.rotZ),
            };
        });

        if (newProjectPatterns.length === 0) {
            setShowErrors(true);
            return;
        }

        await createNewProject({
            variables: {
                name: name.trim(),
                description: description.trim() || null,
                userId,
                newProjectPatterns,
            },
        });
        setShowErrors(false);
        setName('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Save Project</h2>
            <p className={styles.description}>
                Add a name and description, then save your project. Your project will use the selected new patterns.
            </p>

            <div className={sharedStyles.formGroup}>
                <label htmlFor="new-project-name" className={sharedStyles.formLabel}>Project Name</label>
                <input
                    id="new-project-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    className={`${sharedStyles.formInput} ${showErrors && !name.trim() ? styles.inputError : ''}`}
                />
            </div>

            <div className={sharedStyles.formGroup}>
                <label htmlFor="new-project-description" className={sharedStyles.formLabel}>Description</label>
                <textarea
                    id="new-project-description"
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
            {data && <p className={styles.successText}>Project saved: {data.createNewProject.name}</p>}
        </form>
    );
};

import { useState } from "react";
import { Project } from "../utilities/types";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT_WITH_PATTERNS } from "../utilities/gql";
import styles from './CreateProjectForm.module.css';
import sharedStyles from '../styles/components.module.css';

export const CreateProjectForm = ({
    project,
    patternIds,
}: {
    project: Project;
    patternIds: number[];
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const userId = 1; // TODO: get userId from context or props

    const [createProject, { data, loading, error }] = useMutation(CREATE_PROJECT_WITH_PATTERNS);

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
        const projectPatterns = patternIds.map((patternId, i) => {
            const t = project[i]?.transform ?? defaultTransform;
            return {
                patternId,
                x: toFloat(t.x),
                y: toFloat(t.y),
                z: toFloat(t.z),
                rotX: toFloat(t.rotX),
                rotY: toFloat(t.rotY),
                rotZ: toFloat(t.rotZ),
            };
        });

        if (projectPatterns.length === 0) {
            setShowErrors(true);
            return;
        }

        await createProject({
            variables: {
                name: name.trim(),
                description: description.trim() || null,
                userId,
                projectPatterns,
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
                Add a name and description, then save your project. Your project will use the selected patterns.
            </p>

            <div className={sharedStyles.formGroup}>
                <label htmlFor="project-name" className={sharedStyles.formLabel}>Project Name</label>
                <input
                    id="project-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    className={`${sharedStyles.formInput} ${showErrors && !name.trim() ? styles.inputError : ''}`}
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
};

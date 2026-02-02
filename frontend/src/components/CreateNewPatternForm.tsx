import { useState } from 'react'
import { useMutation } from '@apollo/client';
import { CREATE_NEW_PATTERN } from '../utilities/gql';
import { PhysicsNode } from '../pages/TestPageStuff/TestClasses';
import styles from './CreatePatternForm.module.css';
import sharedStyles from '../styles/components.module.css';

interface CreateNewPatternFormProps {
    text: string;
    nodes: PhysicsNode[];
}

export const CreateNewPatternForm = ({ text, nodes }: CreateNewPatternFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const userId = 1; // TODO: get userId from context or props
  
    const [createNewPattern, { data, loading, error }] = useMutation(CREATE_NEW_PATTERN);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!name.trim()) {
            setShowErrors(true);
            return;
        }

        if (nodes.length === 0) {
            setShowErrors(true);
            return;
        }

        // Convert nodes to points format
        // Group nodes by color and flatten to PointInput array
        const points: Array<{ x: number; y: number; z: number; color: string }> = [];
        
        nodes.forEach(node => {
            const color = node.color || 'unknown';
            points.push({
                x: node.x,
                y: node.y,
                z: node.z,
                color: color,
            });
        });

        await createNewPattern({ 
            variables: { 
                name, 
                description: description.trim() || null, 
                text, 
                userId,
                points
            } 
        });
        
        setShowErrors(false);
        setName('');
        setDescription('');
    };
  
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Create New Pattern</h2>
            
            <div className={styles.formContent}>
                <div className={sharedStyles.formGroupCompact}>
                    <label htmlFor="name" className={sharedStyles.formLabel}>Pattern Name</label>
                    <input 
                        id="name"
                        type="text"
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter pattern name" 
                        className={`${sharedStyles.formInput} ${showErrors && !name.trim() ? styles.inputError : ''}`}
                    />
                </div>
                
                <div className={sharedStyles.formGroupCompact}>
                    <label htmlFor="description" className={sharedStyles.formLabel}>Description</label>
                    <textarea 
                        id="description"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Describe your pattern" 
                        className={sharedStyles.formTextarea}
                        rows={2}
                    />
                </div>
                
                <button type="submit" className={styles.submitButton} disabled={nodes.length === 0}>
                    💾 Save Pattern ({nodes.length} points)
                </button>
            </div>
    
            {loading && <p className={styles.loadingText}>Saving...</p>}
            {error && <p className={styles.errorText}>Error: {error.message}</p>}
            {data && <p className={styles.successText}>Saved: {data.createNewPattern.name}</p>}
        </form>
    );
}

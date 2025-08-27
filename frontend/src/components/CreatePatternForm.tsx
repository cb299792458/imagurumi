import { useState } from 'react'
import { useMutation } from '@apollo/client';
import { CREATE_PATTERN } from '../utilities/gql';
import styles from './CreatePatternForm.module.css';
import sharedStyles from '../styles/components.module.css';

export const CreatePatternForm = ({ text, refetch }: { text: string, refetch: () => void }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const userId = 1; // TODO: get userId from context or props
  
    const [createPattern, { data, loading, error }] = useMutation(CREATE_PATTERN);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!name.trim()) {
            setShowErrors(true);
            return;
        }
        await createPattern({ variables: { name, description, text, userId } });
        refetch();
        setShowErrors(false);
        setName('');
        setDescription('');
    };
  
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Create Pattern</h2>
            
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
                
                <button type="submit" className={styles.submitButton}>
                    💾 Save Pattern
                </button>
            </div>
    
            {loading && <p className={styles.loadingText}>Saving...</p>}
            {error && <p className={styles.errorText}>Error: {error.message}</p>}
            {data && <p className={styles.successText}>Saved: {data.createPattern.name}</p>}
        </form>
    );
}

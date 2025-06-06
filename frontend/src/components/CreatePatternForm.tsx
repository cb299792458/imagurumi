import { useState } from 'react'
import { useMutation } from '@apollo/client';
import { CREATE_PATTERN } from '../utilities/gql';

export const CreatePatternForm = ({ text, refetch }: { text: string, refetch: () => void }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const userId = 1; // TODO: get userId from context or props
  
    const [createPattern, { data, loading, error }] = useMutation(CREATE_PATTERN);
  
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await createPattern({ variables: { name, description, text, userId } });
        refetch();
    };
  
    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Pattern</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <button type="submit">Create Pattern With Current Text</button>
    
            {loading && <p>Submitting...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Created pattern: {data.createPattern.name}</p>}
        </form>
    );
}

import { Project, Transform, transforms, TransformKey } from "../utilities/types";

export const PatternTransformer = ({
    index, 
    project, 
    setProject
}: {
    index: number, 
    project: Project, 
    setProject: React.Dispatch<React.SetStateAction<Project>>
}) => {

    return (
        <div style={{ display: 'flex' }}>
            {transforms.map((transform: TransformKey) => (
                <div key={transform} style={{ marginRight: '10px' }}>
                    <label>{transform.length === 1 ? transform.toUpperCase() : transform}</label>
                    <input type="number" 
                        style={{ width: '60px', marginLeft: '5px' }}
                        value={project[index]?.transform?.[transform] ?? 0}
                        onChange={(e) => {
                            const newTransform = { ...project[index].transform, [transform]: parseFloat(e.target.value) };
                            setProject((prev: Project) => {
                                const newModels = [...prev];
                                newModels[index] = { ...newModels[index], transform: newTransform as Transform};
                                return newModels;
                            });
                        }} 
                    />
                </div>
            ))}
        </div>
    )
}

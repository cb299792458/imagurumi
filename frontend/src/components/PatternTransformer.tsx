import { Project, Transform, transforms, TransformKey } from "../utilities/types";
import styles from './PatternTransformer.module.css';

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
        <div className={styles.container}>
            {transforms.map((transform: TransformKey) => (
                <div key={transform} className={styles.transformGroup}>
                    <label className={styles.transformLabel}>
                        {transform.length === 1 ? transform.toUpperCase() : transform}
                    </label>
                    <input 
                        type="number" 
                        className={styles.transformInput}
                        data-axis={transform}
                        value={project[index]?.transform?.[transform] ?? 0}
                        onChange={(e) => {
                            if (!project[index]) return;
                            const currentTransform = project[index].transform || {
                                x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0
                            };
                            const newTransform = { ...currentTransform, [transform]: parseFloat(e.target.value) };
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

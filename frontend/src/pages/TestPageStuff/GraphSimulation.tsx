import { PhysicsNode } from "./TestClasses";
import { NodeSpheres, EdgeLines } from "./TestComponents";
import { useSpringSimulation } from "./useSpringSimulation";

const GraphSimulation = ({
    nodes,
}: {
    nodes: PhysicsNode[];
}) => {
    useSpringSimulation({ nodes });

    return (
        <>
            <NodeSpheres nodes={nodes} />
            <EdgeLines nodes={nodes} />
        </>
    );
}

export default GraphSimulation

import { PhysicsNode } from "./TestClasses";
import { NodeSpheres, EdgeLines } from "./TestComponents";
import { useSpringSimulation } from "./useSpringSimulation";

const GraphSimulation = ({
    nodes,
    nodeColors,
}: {
    nodes: PhysicsNode[];
    nodeColors: string[];
}) => {
    useSpringSimulation({ nodes });

    return (
        <>
            <NodeSpheres nodes={nodes} nodeColors={nodeColors} />
            <EdgeLines nodes={nodes} />
        </>
    );
}

export default GraphSimulation

import { PhysicsEdge, PhysicsNode } from "./TestClasses";
import { NodeSpheres, EdgeLines } from "./TestComponents";
import { useSpringSimulation } from "./useSpringSimulation";

const GraphSimulation = ({
    nodes,
    edges,
}: {
    nodes: PhysicsNode[];
    edges: PhysicsEdge[];
}) => {
    useSpringSimulation({ nodes, edges });

    return (
        <>
            <NodeSpheres nodes={nodes} />
            <EdgeLines nodes={nodes} edges={edges} />
        </>
    );
}

export default GraphSimulation

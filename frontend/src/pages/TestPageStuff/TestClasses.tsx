
export class PhysicsNode {
    x = (Math.random() - 0.5) * 15;
    y = (Math.random() - 0.5) * 15;
    z = (Math.random() - 0.5) * 15;
    vx = 0;
    vy = 0;
    vz = 0;
    ax = 0;
    ay = 0;
    az = 0;
}

export class PhysicsEdge {
    nodeI: number;
    nodeJ: number;
    restLength: number = 1;

    constructor(nodeI: number, nodeJ: number) {
        this.nodeI = nodeI; // first node index
        this.nodeJ = nodeJ; // second node index
    }
}

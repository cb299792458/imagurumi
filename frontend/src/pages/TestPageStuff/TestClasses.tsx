
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
    neighbors: PhysicsNode[] = [];
    restLength = 0.1;

    color?: string;

    constructor(color?: string) {
        this.color = color;
    }
}

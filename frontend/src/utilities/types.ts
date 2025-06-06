export type Row = {
    color: string;
    stitches: number;
    circumradius: number;
    height: number;
}

export type ColoredPoints = {
    color: string;
    points: number[][];
}
export type PatternPoints = ColoredPoints[]

export type TransformKey = 'x' | 'y' | 'z' | 'rotX' | 'rotY' | 'rotZ';
export const transforms: TransformKey[] = ['x', 'y', 'z', 'rotX', 'rotY', 'rotZ'];
export type Transform = {
    x: number;
    y: number;
    z: number;
    rotX: number;
    rotY: number;
    rotZ: number;
}

export type TransformedPattern = {
    patternId?: number;
    patternPoints: PatternPoints;
    transform?: Transform;
}
export type Project = TransformedPattern[];

export type PatternRecord = {
    id: number;
    name: string;
    description: string;
    text: string;
}

export type ProjectPatternRecord = Transform & {
    id?: number;
    projectId?: number;
    patternId: number;
    pattern: PatternRecord;
}

export type ProjectRecord = {
    id?: number;
    name: string;
    description: string;
    projectPatterns: ProjectPatternRecord[];
}

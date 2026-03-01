import { PatternRecord, Project, ProjectPatternRecord, ProjectRecord, ColoredPoints, Transform } from "./types";
import { Pattern, FlatPattern, SpiralPattern } from "./Pattern";
import { PhysicsNode } from "../pages/TestPageStuff/TestClasses";

export const projectRecordToProject = (project: ProjectRecord): Project => {
    return project.projectPatterns.map((projectPattern: ProjectPatternRecord) => {
        const { pattern, x, y, z, rotX, rotY, rotZ } = projectPattern;
        const { text } = pattern;

        const patternInstance = textToPatternInstance(text);
        const patternPoints = patternInstance.toPatternPoints();

        return {
            patternId: pattern.id,
            patternPoints,
            transform: {
                x,
                y,
                z,
                rotX,
                rotY,
                rotZ,
            }
        }
    });
}

export const patternRecordsToProject = (prev: Project, patterns: PatternRecord[]): Project => {
    return patterns.map((pattern: PatternRecord, i: number) => {
        const existing = prev[i];
        const patternInstance = textToPatternInstance(pattern.text);
        const patternPoints = patternInstance.toPatternPoints();

        return {
            patternId: pattern.id,
            patternPoints,
            transform: existing?.transform || {
                x: 0,
                y: 0,
                z: 0,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
            },
        };
    });
}

export const textToPatternInstance = (text: string): Pattern => {
    const patternType = text.split('\n')[0].trim();
    let patternInstance;

    switch (patternType) {
        case '@crochet-spiral':
            patternInstance = new SpiralPattern(text);
            break;
        case '@crochet-flat':
            patternInstance = new FlatPattern(text);
            break;
        case '@crochet-simple':
        default:
            patternInstance = new SpiralPattern(text);
            break;
    }

    return patternInstance;
}

const defaultTransform: Transform = { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };

/**
 * Convert a NewProject from the API (with newProjectPatterns and newPattern.points) to Project for ThreeCanvas.
 */
export const newProjectRecordToProject = (newProject: {
    newProjectPatterns: Array<{
        x: number;
        y: number;
        z: number;
        rotX: number;
        rotY: number;
        rotZ: number;
        newPattern: { points: Array<{ x: number; y: number; z: number; color: string }> };
    }>;
}): Project => {
    return newProject.newProjectPatterns.map((npp) => ({
        patternPoints: pointsToColoredPoints(npp.newPattern.points),
        transform: {
            x: npp.x,
            y: npp.y,
            z: npp.z,
            rotX: npp.rotX,
            rotY: npp.rotY,
            rotZ: npp.rotZ,
        },
    }));
};

/**
 * Build a Project (for ThreeCanvas) from an array of NewPatterns, preserving transforms by index.
 */
export const newPatternsToProject = (
    prev: Project,
    newPatterns: Array<{ id: number; points: Array<{ x: number; y: number; z: number; color: string }> }>
): Project => {
    return newPatterns.map((np, i) => ({
        patternPoints: pointsToColoredPoints(np.points),
        transform: prev[i]?.transform ?? defaultTransform,
    }));
};

/**
 * Convert PhysicsNode array to ColoredPoints format
 * Groups nodes by color and converts to the format expected by ThreeCanvas
 */
export const nodesToColoredPoints = (nodes: PhysicsNode[]): ColoredPoints[] => {
    const colorMap = new Map<string, number[][]>();
    
    nodes.forEach(node => {
        const color = node.color || 'unknown';
        if (!colorMap.has(color)) {
            colorMap.set(color, []);
        }
        colorMap.get(color)!.push([node.x, node.y, node.z]);
    });

    return Array.from(colorMap.entries()).map(([color, points]) => ({
        color,
        points
    }));
};

/**
 * Convert database points array to ColoredPoints format
 */
export const pointsToColoredPoints = (points: Array<{
    x: number;
    y: number;
    z: number;
    color: string;
}>): ColoredPoints[] => {
    const colorMap = new Map<string, number[][]>();
    
    points.forEach(point => {
        const color = point.color || 'unknown';
        if (!colorMap.has(color)) {
            colorMap.set(color, []);
        }
        colorMap.get(color)!.push([point.x, point.y, point.z]);
    });

    return Array.from(colorMap.entries()).map(([color, points]) => ({
        color,
        points
    }));
};

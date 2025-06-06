import { Pattern } from "./Pattern";
import { PatternRecord, Project, ProjectPatternRecord, ProjectRecord } from "./types";

export const projectRecordToProject = (project: ProjectRecord): Project => {
    return project.projectPatterns.map((projectPattern: ProjectPatternRecord) => {
        const { pattern, x, y, z, rotX, rotY, rotZ } = projectPattern;
        const patternInstance = new Pattern(pattern.text);
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
        const patternInstance = new Pattern(pattern.text);
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
    })
}

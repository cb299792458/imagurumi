import { PatternPoints, Row } from "./types";

export type Pattern = SpiralPattern | FlatPattern;

export class FlatPattern {
    text: string;
    rows: Row[] = [];

    constructor(text: string) {
        this.text = text.split(/\r?\n/).map(s => s.trim()).join('\n');
        this.parse();
    }

    parse = () => {
        let color = 'unknown';
        let height = 0;
        const lines = this.text.split('\n');
        for (const line of lines) {
            if (['@', '#'].includes(line[0])) continue;
            
            const isNumeric = /^\d+$/.test(line);
            if (isNumeric) {
                const row = {
                    color,
                    stitches: parseInt(line),
                    height,
                }

                this.rows.push(row);
                height += 1;
            } else {
                color = line.trim();
            }
        }
    }

    toString = () => {
        let currentColor: string = 'unknown';
        let lastStitches: number = 0;
        let rows: number = 0;
        const lines: string[] = []
        
        this.rows.forEach((row, index) => {
            const { stitches, color } = row;
            if (currentColor !== color) {
                currentColor = color;
                lines.push(`in ${color}`);
            }

            rows++;
            if (index === 0) {
                lines.push(`Row 1: chain ${stitches}`);
            } else {
                const increases = stitches - lastStitches;
                if (increases === 0) {
                    lines.push(`Row ${rows}: ${stitches} sc`);
                } else if (increases >= 0) {
                    const singles = lastStitches - increases;
                    if (singles < 0) throw new Error('too many increases?');

                    const singlesPerIncrease = Math.floor(singles / increases);
                    const remainder = singles % increases;

                    lines.push(`Row ${rows}: (${singlesPerIncrease ? singlesPerIncrease + ' sc, ' : ''}2 sc in next st) x ${increases}${remainder ? ', ' + remainder + ' sc' : ''}`);
                } else {
                    const decreases = -increases;
                    const singles = lastStitches - decreases;
                    if (singles < 0) throw new Error('too many decreases?');

                    const singlesPerDecrease = Math.floor(singles / decreases);
                    const remainder = singles % decreases;

                    lines.push(`Row ${rows}: (${singlesPerDecrease ? singlesPerDecrease + ' sc, ' : ''}sc2tog) x ${decreases}${remainder ? ', ' + remainder + ' sc' : ''}`);
                }
            }
            lastStitches = stitches;
        });
        lines.push('cut yarn and fasten');

        return lines.join('\n');
    }

    toPatternPoints = (): PatternPoints => {
        const res: PatternPoints = [];
        for (const row of this.rows) {
            const { stitches, height, color } = row;
            const points: number[][] = [];

            for (let i = 0; i < stitches; i++) {
                const x = i - (stitches - 1) / 2; // center the row
                points.push([ x, height, 0 ]); // z is always 0 for flat patterns
            }

            res.push({ color, points });
        }

        return res;
    }
}

export class SpiralPattern {
    text: string;
    rows: Row[] = [];

    constructor(text: string) {
        this.text = text.split(/\r?\n/).map(s => s.trim()).join('\n');
        this.parse();
    }
    
    parse = () => { // simple version that just takes colors and numbers
        let color = 'unknown';
        let height = 0;
        const lines = this.text.split('\n');
        for (const line of lines) {
            if (['@', '#'].includes(line[0])) continue;
            
            const isNumeric = /^\d+$/.test(line);
            if (isNumeric) {
                const stitches = parseInt(line);
                const circumradius = getCircumradius(stitches);
                if (this.rows.length) {
                    const lastRow = this.rows[this.rows.length - 1];
                    const lastCircumradius = lastRow.circumradius || 0;
                    const radiusIncrease = circumradius - lastCircumradius;
                    if (Math.abs(radiusIncrease) > 1) {
                        throw new Error('new row too big/small for last row');
                    }
                    height = lastRow.height + Math.sqrt(1 - Math.pow(radiusIncrease, 2));
                }

                const row = {
                    color,
                    stitches,
                    circumradius, 
                    height,
                }
                this.rows.push(row);
            } else {
                color = line.trim();
            }
        }
    }

    toString = () => {
        let currentColor: string = 'unknown';
        let lastStitches: number = 0;
        let rows: number = 0;
        const lines: string[] = []
        
        this.rows.forEach((row, index) => {
            const { stitches, color } = row;
            if (currentColor !== color) {
                currentColor = color;
                lines.push(`in ${color}`);
            }

            rows++;
            if (index === 0) {
                lines.push(`Row 1: ${stitches} sc in magic ring`);
            } else {
                const increases = stitches - lastStitches;
                if (increases === 0) {
                    lines.push(`Row ${rows}: ${stitches} sc`);
                } else if (increases >= 0) {
                    const singles = lastStitches - increases;
                    if (singles < 0) throw new Error('too many increases?');

                    const singlesPerIncrease = Math.floor(singles / increases);
                    const remainder = singles % increases;

                    lines.push(`Row ${rows}: (${singlesPerIncrease ? singlesPerIncrease + ' sc, ' : ''}inc) x ${increases}${remainder ? ', ' + remainder + ' sc' : ''}`);
                } else {
                    const decreases = -increases;
                    const singles = lastStitches - decreases;
                    if (singles < 0) throw new Error('too many decreases?');

                    const singlesPerDecrease = Math.floor(singles / decreases);
                    const remainder = singles % decreases;

                    lines.push(`Row ${rows}: (${singlesPerDecrease ? singlesPerDecrease + ' sc, ' : ''}inc) x ${decreases}${remainder ? ', ' + remainder + ' sc' : ''}`);
                }
            }
            lastStitches = stitches;
        });
        lines.push('cut yarn and fasten');

        return lines.join('\n');
    }

    toPatternPoints = (): PatternPoints => {
        const res: PatternPoints = [];
        for (const row of this.rows) {
            const { stitches, circumradius = 0, height, color } = row;
            const points: number[][] = [];
            
            for (let i = 0; i < stitches; i++) {
                const angle = (i / stitches) * Math.PI * 2;
                const x = circumradius * Math.cos(angle);
                const y = circumradius * Math.sin(angle);
                points.push([ x, y, height ]);  
            }

            res.push({color, points});
        }
        return res;
    }

    oldParse() {
        let color = 'unknown';
        const lines = this.text.split('\n');
        for (const line of lines) {
            const parts = line.trim().split(' ');
            switch (parts[0]) {
                case '':
                    break;
                case '!color':
                    color = parts[1].slice(1);
                    break;
                case '!cut-fill-close':
                    break;

                case '!mr': {
                    if (this.rows.length) throw new Error('magic ring should be used to start a pattern');
                    const stitches = readInt(parts[1]);
                    if (parts[2]) {
                        const stitches2 = readInt(parts[2]);
                        if (stitches2 !== stitches) {
                            throw new Error('magic ring stitch count should be equal to the number of stitches');
                        }
                    }
                    
                    const circumradius = getCircumradius(stitches);
                    this.rows.push({
                        color,
                        stitches,
                        circumradius,
                        height: 0,
                    });
                    break;
                }
                
                default: {
                    if (!this.rows.length) throw new Error('magic ring should be used to start a pattern');
                    const row = buildRow(line, this.rows[this.rows.length-1] as Row, color);
                    this.rows.push(row);
                }
            }
        }
    }
}

const readInt = (s: string): number => {
    const digits = s.match(/\d/g);
    return digits ? parseInt(digits.join('')) : 0;
}

const buildRow = (line: string, lastRow: Row, color: string): Row => {
    const { circumradius: lastCircumradius, height: lastHeight } = lastRow;
    const parts = line.split(' ');
    
    // TODO: count stitches instead of shortcut
    const stitches = readInt(parts[parts.length - 1]);
    const circumradius = getCircumradius(stitches);
    const radiusIncrease = circumradius - (lastCircumradius || 0);
    if (Math.abs(radiusIncrease) > 1) {
        throw new Error('new row too big/small for last row');
    }
    const height = lastHeight + Math.sqrt(1 - Math.pow(radiusIncrease, 2));
    
    return {
        color,
        stitches,
        circumradius,
        height,
    };
}   

const getCircumradius = (stitches: number) => {
    return 1 / (2 * Math.sin(Math.PI / stitches));
}

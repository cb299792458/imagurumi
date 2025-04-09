export class Pattern {
    text: string;
    rows: Row[] = [];

    constructor(text: string) {
        this.text = text;
        this.parse();
    }

    rowsToString = () => {
        const rows = this.rows.map((row) => {
            return `${row.color} ${row.stitches} ${row.circumradius} ${row.height}`;
        });
        return rows.join('\n');
    }

    rowsToPoints = () => {
        const res: number[][][] = [];
        for (const row of this.rows) {
            const { stitches, circumradius, height } = row;
            const points: number[][] = [];
            for (let i = 0; i < stitches; i++) {
                const angle = (i / stitches) * Math.PI * 2;
                const x = circumradius * Math.cos(angle);
                const y = circumradius * Math.sin(angle);
                points.push([ x, y, height ]);  
            }
            res.push(points);
        }
        return res;
    }

    parse() {
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

                case '!mr':
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
                
                default:
                    if (!this.rows.length) throw new Error('magic ring should be used to start a pattern');
                    const row = buildRow(line, this.rows[this.rows.length-1] as Row);
                    this.rows.push(row);
            }
        }
    }
}

const readInt = (s: string) => {
    const digits = s.match(/\d/g);
    return digits ? parseInt(digits.join('')) : 0;
}

type Row = {
    color: string;
    stitches: number;
    circumradius: number;
    height: number;
}

const buildRow = (line: string, lastRow: Row): Row => {
    const { color, circumradius: lastCircumradius, height: lastHeight } = lastRow;
    const parts = line.split(' ');
    
    // TODO: count stitches instead of shortcut
    
    const stitches = readInt(parts[parts.length - 1]);
    const circumradius = getCircumradius(stitches);
    const radiusIncrease = circumradius - lastCircumradius;
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

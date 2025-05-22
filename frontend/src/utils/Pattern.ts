type Row = {
    color: string;
    stitches: number;
    circumradius: number;
    height: number;
}

export class Pattern {
    text: string;
    rows: Row[] = [];

    constructor(text: string) {
        this.text = text.split(/\r?\n/).map(s => s.trim()).join('\n');
        this.parse();
    }

    parse() {
        const lines = this.text.split('\n');
        for (const line of lines) {
            const parts = line.split(' ');
            if (parts.length !== 4) continue;
            const color = parts[0];
            const stitches = parseInt(parts[1]);
            const circumradius = parseFloat(parts[2]);
            const height = parseFloat(parts[3]);
            this.rows.push({ color, stitches, circumradius, height });
        }
    }
}

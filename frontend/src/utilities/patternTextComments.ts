/** Toggle `// ` after leading whitespace (VS Code–style line comment). */
export function toggleOneLineComment(line: string): string {
    const m = line.match(/^(\s*)(.*)$/);
    if (!m) return line;
    const indent = m[1];
    let rest = m[2];
    if (rest.startsWith("//")) {
        rest = rest.slice(2);
        if (rest.startsWith(" ")) rest = rest.slice(1);
        return indent + rest;
    }
    return indent + "// " + rest;
}

export function toggleCommentAtSelection(
    value: string,
    selectionStart: number,
    selectionEnd: number
): { text: string; selectionStart: number; selectionEnd: number } {
    const oldLines = value.split("\n");
    const startLine = value.slice(0, selectionStart).split("\n").length - 1;
    const endLine = value.slice(0, selectionEnd).split("\n").length - 1;

    const newLines = oldLines.map((line, i) =>
        i >= startLine && i <= endLine ? toggleOneLineComment(line) : line
    );
    const text = newLines.join("\n");

    const mapOffset = (oldOffset: number): number => {
        const lineIdx = value.slice(0, oldOffset).split("\n").length - 1;
        const lineStartOld = oldOffset === 0 ? 0 : value.lastIndexOf("\n", oldOffset - 1) + 1;
        const col = oldOffset - lineStartOld;
        const oldLine = oldLines[lineIdx];
        const newLine = newLines[lineIdx];
        const indent = /^(\s*)/.exec(oldLine)?.[1] ?? "";
        const delta = newLine.length - oldLine.length;

        let pos = 0;
        for (let i = 0; i < lineIdx; i++) {
            pos += newLines[i].length + 1;
        }
        if (lineIdx >= startLine && lineIdx <= endLine) {
            if (col <= indent.length) {
                pos += col;
            } else {
                pos += col + delta;
            }
        } else {
            pos += col;
        }
        return pos;
    };

    return {
        text,
        selectionStart: mapOffset(selectionStart),
        selectionEnd: mapOffset(selectionEnd),
    };
}

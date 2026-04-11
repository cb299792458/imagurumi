export type SamplePattern = {
    id: string;
    label: string;
    text: string;
};

/** Short sample patterns that match the parser in `utilities/parser.ts`. */
export const SAMPLE_PATTERNS: SamplePattern[] = [
    {
        id: "sphere-test-series",
        label: "Sphere in Spiral",
        text: `#FF0000
            mr6
            incx6
            (sc,inc) x 6
            (scx2,inc) x 6
            (scx3,inc) x 6
            scx30
            scx30
            scx30
            scx30
            scx30
            (scx3,dec) x 6
            (scx2,dec) x 6
            (sc,dec) x 6
            decx6`,
    },
    {
        id: "tube",
        label: "Closed Tube",
        text: `#00FF00
            mr6
            incx6
            (sc,inc) x 6
            (scx2,inc) x 6
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24
            scx24`,
    },
    {
        id: "pouch",
        label: "Open Pouch",
        text: `#0000FF
            ch10
            (scx8,inc) x 2
            scx20
            scx20
            scx20
            scx20
            scx20`,
    },
    {
        id: "trapezoid",
        label: "Trapezoid",
        text: `#FFFF00
            ch6
            inc,scx4,inc
            scx8
            inc,scx6,inc
            scx10
            inc,scx8,inc
            scx12`,
    },
    {
        id: "circle",
        label: "Circle in Rows",
        text: `#00FFFF
            ch5
            inc,inc,sc,inc,inc
            inc,scx7,inc
            inc,scx9,inc
            scx13
            scx13
            scx13
            scx13
            dec,scx9,dec
            dec,scx7,dec
            dec,dec,sc,dec,dec`,
    },
    {
        id: "square",
        label: "Square in Rows",
        text: `#FF00FF
            ch12
            scx12
            scx12
            scx12
            scx12
            scx12
            scx12
            scx12
            scx12
            scx12
            scx12`,
    },
    {
        id: "rectangle-spiral",
        label: "Rectangle in Spiral",
        text: `#AAAAAA
            ch6
            scx4, inc3, scx4, inc3
            (scx4, inc3, sc, inc3) x2
            (scx5, inc3, scx3, inc3, sc) x2`,
    },
];

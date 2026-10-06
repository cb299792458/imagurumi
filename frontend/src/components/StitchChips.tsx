import { useEffect, useRef, useState } from 'react';
import styles from './StitchChips.module.css';

export type StitchChip = {
    label: string;
    snippet: string;
    hint: string;
    ownLine?: boolean;
};

type ChipGroup = {
    title: string;
    chips: StitchChip[];
    note?: string;
};

const CHIP_GROUPS: ChipGroup[] = [
    {
        title: 'Start with',
        note: 'the 6 is just an example, change it to any number',
        chips: [
            { label: 'mr6', snippet: 'mr6', hint: 'magic ring, for a round piece', ownLine: true },
            { label: 'ch6', snippet: 'ch6', hint: 'chain, for a flat piece', ownLine: true },
        ],
    },
    {
        title: 'Stitches',
        chips: [
            { label: 'sc', snippet: 'sc', hint: 'keeps the width the same' },
            { label: 'inc', snippet: 'inc', hint: 'makes it wider by 1' },
            { label: 'dec', snippet: 'dec', hint: 'makes it narrower by 1' },
        ],
    },
    {
        title: 'Shortcuts',
        chips: [
            { label: 'sc x 6', snippet: 'sc x 6', hint: '6 of the same stitch' },
            { label: '(sc, inc) x 6', snippet: '(sc, inc) x 6', hint: 'repeat a group 6 times', ownLine: true },
        ],
    },
];

interface ColorPickerChipProps {
    onPick: (hex: string) => void;
}

const ColorPickerChip = ({ onPick }: ColorPickerChipProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const onPickRef = useRef(onPick);
    onPickRef.current = onPick;
    const [hasPicked, setHasPicked] = useState(false);

    useEffect(() => {
        const input = inputRef.current;
        if (!input) {
            return;
        }
        const handleCommit = () => {
            setHasPicked(true);
            onPickRef.current(input.value.toUpperCase());
        };
        input.addEventListener('change', handleCommit);
        return () => input.removeEventListener('change', handleCommit);
    }, []);

    return (
        <label className={styles.chip} title="Pick any color to start a new color section">
            <span className={styles.chipLabel}>
                <input
                    ref={inputRef}
                    type="color"
                    defaultValue="#FFCC00"
                    className={`${styles.colorInput} ${hasPicked ? '' : styles.colorInputUnpicked}`}
                    aria-label="Pick a yarn color"
                />
                Pick a color
            </span>
            <span className={styles.chipHint}>everything below it uses that color</span>
        </label>
    );
};

interface StitchChipsProps {
    onInsert: (chip: StitchChip) => void;
    onPickColor: (hex: string) => void;
}

export const StitchChips = ({ onInsert, onPickColor }: StitchChipsProps) => (
    <div className={styles.palette}>
        {CHIP_GROUPS.map((group) => (
            <div key={group.title} className={styles.group}>
                <span className={styles.groupTitle}>{group.title}</span>
                <div className={styles.chips}>
                    {group.chips.map((chip) => (
                        <button
                            key={chip.label}
                            type="button"
                            className={styles.chip}
                            onClick={() => onInsert(chip)}
                            title={`${chip.label}: ${chip.hint}`}
                        >
                            <span className={styles.chipLabel}>{chip.label}</span>
                            <span className={styles.chipHint}>{chip.hint}</span>
                        </button>
                    ))}
                </div>
                {group.note && <span className={styles.groupNote}>{group.note}</span>}
            </div>
        ))}
        <div className={styles.group}>
            <span className={styles.groupTitle}>Color</span>
            <div className={styles.chips}>
                <ColorPickerChip onPick={onPickColor} />
            </div>
        </div>
    </div>
);

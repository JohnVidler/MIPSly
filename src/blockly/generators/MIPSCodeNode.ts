let globalSpanID = 0;
export function getSpanID(): number {
    return ++globalSpanID;
}

export function resetSpans() {
    globalSpanID = 0;
}

export default class MIPSCodeNode {
    public span: number | undefined;

    constructor() {
        this.span = getSpanID()
    }

    getMIPS(): string {
        return this.code || "";
    }

    getSpan(): number {
        return this.span || -1;
    }

    getHTML(): string {
        return `<span>${this.getMIPS()}</span>`;
    }
}
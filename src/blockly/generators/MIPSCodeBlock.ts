import MIPSCodeNode, { getSpanID } from "./MIPSCodeNode";

export default class MIPSCodeBlock extends MIPSCodeNode {
    public children: MIPSCodeNode[];

    constructor() {
        super();
        this.children = [];
    }

    getChildren(): MIPSCodeNode[] {
        return this.children;
    }

    getMIPS(): string {
        return this.children.map( child => child.getMIPS() ).join("\n");
    }

    getHTML(): string {
        return `<div class="scope">${this.children.map( child => child.getHTML() ).join("\n")}</div>`;
    }
}
import MIPSCodeNode from "./MIPSCodeNode";

export default class MIPSComment extends MIPSCodeNode {
    constructor( text: string ) {
        super();
        this.code = text.split('\n').map( v => `# ${v}`).join('\n');
    }

    getHTML(): string {
        if( this.code )
            return this.code?.split('\n').map( line => `<div class="line">${line}</div>` ).join("");

        return "";
    }
}
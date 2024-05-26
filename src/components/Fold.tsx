import { useState } from "react";

export default function NetworkWiringTab( props ) {
    const [state, setState] = useState<boolean>( false );
    const title = props.title || "Details";

    function showHide() {
        setState( !state );
        console.log( "click", state );
    }

    return (
        <div className={ "boxed " + props.className }>
            <div className="font-bold flex flex-row">
                <button onClick={showHide} className="btn btn-sm m-1">
                    {state == true && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    ) || (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    )}
                </button>
                <div className="grow p-2">{title}</div>
            </div>
            {state == true && (<div className="">{props.children}</div>)}
        </div>
    );
}
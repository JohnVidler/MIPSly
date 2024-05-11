import { useState } from "react";
import { LOGIC_COMPONENTS, getPrefabIndex } from "../blockly/stationpedia";

export function NetworkDevice( props ) {
    const [getName, setName] = useState();
    const [getDescription, setDescription ] = useState();

    function updateInfo( e ) {
        const { value } = e.target;
        if( LOGIC_COMPONENTS[value] )
            setDescription( LOGIC_COMPONENTS[value].description );
        else
            setDescription( "" );
    }

    return (
        <div className={"device_"+getName}>
            <div class="inline p3">{props.port}</div>
            <select class="p3" onChange={updateInfo}>
                <option value="_disconnected">Disconnected (None)</option>
                { getPrefabIndex().map( v => (<option value={v[1]}>{v[0]}</option>) ) }
            </select>
            <div>{getDescription}</div>
        </div>
    );
};
import { useState } from "react";
import { LOGIC_COMPONENTS, getPrefabIndex } from "../blockly/stationpedia";

interface NetworkDeviceProps {
    port: string
}

export function NetworkDevice( props: NetworkDeviceProps ) {
    const [getName] = useState<string>();
    const [getDescription, setDescription] = useState<string>();

    function updateInfo( e ) {
        const { value } = e.target;
        if( LOGIC_COMPONENTS[value] )
            setDescription( LOGIC_COMPONENTS[value].description );
        else
            setDescription( "" );
    }

    return (
        <div className={"device_"+getName}>
            <div className="inline p3">{props.port}</div>
            <select className="p3" onChange={updateInfo}>
                <option value="_disconnected">Disconnected (None)</option>
                { getPrefabIndex().map( v => (<option key={v[1]} value={v[1]}>{v[0]}</option>) ) }
            </select>
            <div>{getDescription}</div>
        </div>
    );
};
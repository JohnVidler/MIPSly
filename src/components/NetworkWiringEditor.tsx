import { useState, useEffect } from "react";
import { LOGIC_COMPONENTS, getPrefabIndex } from "../blockly/stationpedia";
import * as Serialization from '../blockly/serialization';
import Fold from './Fold';

let nextId = 0;

export function Network() {
    const [devices, setDevices] = useState([]);
    const [nextDevice, setNextDevice] = useState<string>("none");

    function addDevice() {
        const deviceList = [
            ...devices,
            {
                type: nextDevice,
                id: ++nextId
            }
        ];

        const data = Serialization.read();
        data.devices = deviceList;
        Serialization.write( data );

        setDevices( deviceList );
    }

    useEffect(() => {
        const data = Serialization.read();
        setDevices( data.devices );
    }, []);

    return (<div className="border-4 border-red-700" >
        <div className="w-full bg-secondary text-secondary-content p-1 font-bold font-mono">Network</div>
        <div className="p-3 space-y-3">
            { devices.map(device => ( <DeviceBlock id={device.id} type={device.type} /> )) }

            <div className="grid grid-rows-1 grid-cols-10">
                <select onChange={e => setNextDevice(e.target.value)} className="select select-bordered col-span-3 self-center">
                    { getPrefabIndex().sort( (a,b) => a[1].localeCompare(b[1]) ).map( prefab => (<option value={prefab[0]}>{prefab[1]}</option>) ) }
                </select>
                <button className="btn btn-sm self-center" onClick={addDevice}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    &nbsp; Add Device
                </button>
            </div>
        </div>
    </div>)
}

export function DeviceBlock( props ) {
    return (<div className="boxed w-full">
        <div className="w-full bg-secondary text-secondary-content p-1 font-bold font-mono">{LOGIC_COMPONENTS[props.type].name} (id = {props.id})</div>
        <div className="p-1">
            {LOGIC_COMPONENTS[props.type].description}
        </div>

        <div className="p-1 space-x-1">
            {Object.keys(LOGIC_COMPONENTS[props.type].logic).length > 0 && (
                Object.keys(LOGIC_COMPONENTS[props.type].logic).sort( (a,b)=> a.localeCompare(b) ).map( prop => (<div className="badge badge-outline">{prop}</div>))
            )}
        </div>

        <Fold title="Show Details" className="m-1">
            <div className="p-1 space-x-1">
                <pre>{JSON.stringify(LOGIC_COMPONENTS[props.type], null, 2)}</pre>
            </div>
        </Fold>
    </div>);
}

export function NetworkWiringTab() {

    return (
        <div className="grow">
            <Network />
        </div>
    );
}
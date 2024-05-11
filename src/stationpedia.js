import unity_data from './data/Stationpedia.json';

const TAG_REGEX = /\<[^\>]+\>/gi;

export const ACCESS = { Read: 0, Write: 1 };
export const LOGIC_COMPONENTS = {};

export function getPrefabIndex() {
    const list = [];

    for( const name in LOGIC_COMPONENTS )
        list.push( [ name, name ] );

    return list;
}

// Do some preprocessing of the raw Stationpedia data...
for( let page of unity_data.pages ) {
    page.Description = page.Description.replaceAll( TAG_REGEX, "" );

    if( page.LogicInsert.length > 0 || page.LogicSlotInsert.length > 0 || page.SlotInserts.length > 0 ) {
        LOGIC_COMPONENTS[page.PrefabName] = {
            "name": page.Title,
            "description": page.Description,
            "hash": page.PrefabHash,
            "logic": {},
            "logicSlots": {},
            "slots": {},
        };
    }

    for( const insert of page.LogicInsert ) {
        insert.LogicName = insert.LogicName.replaceAll( TAG_REGEX, "" );

        LOGIC_COMPONENTS[page.PrefabName].logic[ insert.LogicName ] = {};

        if( insert.LogicAccessTypes.includes("Read") )
            LOGIC_COMPONENTS[page.PrefabName].logic[ insert.LogicName ].canRead = true;

        if( insert.LogicAccessTypes.includes("Write") )
            LOGIC_COMPONENTS[page.PrefabName].logic[ insert.LogicName ].canWrite = true;

        if( page[`${insert.LogicName}Insert`] ) {
            LOGIC_COMPONENTS[page.PrefabName].logic[ insert.LogicName ].values = page[`${insert.LogicName}Insert`].map( (v) => [ v.LogicName, v.LogicAccessTypes ] );
        }
    }

    for( const insert of page.LogicSlotInsert ) {
        insert.LogicName = insert.LogicName .replaceAll( TAG_REGEX, "" );

        LOGIC_COMPONENTS[page.PrefabName].logicSlots[ insert.LogicName ] = JSON.parse(`[${insert.LogicAccessTypes}]`);
    }

    for( const insert of page.SlotInserts ) {
        LOGIC_COMPONENTS[page.PrefabName].slots[ insert.SlotName ] = { "type": insert.SlotType, "index": insert.SlotIndex };
    }
}
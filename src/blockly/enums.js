import unity_enums from './data/Enums.json';

// Populate the sound enum
export const ENUM_SOUND = [];
for( const key in unity_enums.Enums ) {
    if( key.startsWith("Sound.") )
        ENUM_SOUND.push( [ key.split(".")[1], unity_enums.Enums[key] ] );
}

export const ENUM_LOGIC = [];
for( const key in unity_enums.LogicType )
    ENUM_LOGIC.push( [ `${key}`, `${key}` ] );
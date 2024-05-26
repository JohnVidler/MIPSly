export async function ic10encode( code, target ) {
    const ic10context = {
        "vm": {
            "ics": [
                {
                    "device": 1,
                    "id": 2,
                    "registers": Array(18).fill(0),
                    "ip": 0,
                    "ic": 1,
                    "stack": Array(512).fill(0),
                    "aliases": new Map(),
                    "defines": new Map(),
                    "pins": Array(6).fill(undefined),
                    "state": "Start",
                    "code": code
                }
            ],
            "devices": [
                {
                    "id": 1,
                    "prefab_name": "StructureCircuitHousing",
                    "slots": [
                        {
                            "typ": "ProgrammableChip",
                            "occupant": { "id": 2, "fields": new Map() }
                        }
                    ],
                    "connections": [
                        { "CableNetwork": { "net": 1, "typ": "Data" } },
                        { "CableNetwork": { "net": undefined, "typ": "Power" } }
                    ],
                    "fields": {}
                }
            ],
            "networks": [
                {
                    id: 1,
                    devices: [1],
                    power_only: [],
                    channels: Array(8).fill(NaN),
                },
            ],
            //"networks": [],
            //"devices": [],
            "default_network": 1
        },
        "activeIC": 1
    };

    const compressed = arrayBufferToBase64(await compress(JSON.stringify(ic10context, replacer), 'gzip'));

    // Convert and compress for ic10emu :)
    target( "https://ic10emu.dev/#" + compressed )
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function compress(string, encoding) {
    const byteArray = new TextEncoder().encode(string);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray, encoding) {
    const cs = new DecompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
        return new TextDecoder().decode(arrayBuffer);
    });
}

// Transposed to JS from https://github.com/Ryex/ic10emu/blob/e39a3171c72e4773372314cabe94a93bd4749cec/www/src/ts/utils.ts#L15
// Included here for interoperability with permission.
function isZeroNegative(zero) {
    return Object.is(zero, -0)
}

// Transposed to JS from https://github.com/Ryex/ic10emu/blob/e39a3171c72e4773372314cabe94a93bd4749cec/www/src/ts/utils.ts#L19
// Included here for interoperability with permission.
function numberToString(n) {
    if (isZeroNegative(n)) return "-0";
    return n.toString();
}

// Transposed to JS from https://github.com/Ryex/ic10emu/blob/e39a3171c72e4773372314cabe94a93bd4749cec/www/src/ts/utils.ts#L27
// Included here for interoperability with permission.
function replacer(_key, value ) {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else if (
      typeof value === "number" &&
      (!Number.isFinite(value) || Number.isNaN(value) || isZeroNegative(value))
    ) {
      return {
        dataType: "Number",
        value: numberToString(value),
      };
    } else if (typeof value === "undefined") {
      return {
        dataType: "undefined",
      };
    } else {
      return value;
    }
  }
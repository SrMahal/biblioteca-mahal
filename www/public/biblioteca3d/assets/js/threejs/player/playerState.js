export function createPlayerState(id = "local") {
    return {
        id,
        position: {
            x: 0,
            y: 5,
            z: 5
        },
        rotation: {
            y: 0
        },
        velocity: {
            x: 0,
            y: 0,
            z: 0
        },
        isMoving: false
    };
}
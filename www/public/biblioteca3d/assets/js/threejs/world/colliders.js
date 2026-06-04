export function createColliders({
    floor,
    cubes = []
}) {
    const colliders = [];

    if (floor) {
        colliders.push(floor);
    }

    cubes.forEach((cube) => {
        if (cube) {
            colliders.push(cube);
        }
    });

    return colliders;
}
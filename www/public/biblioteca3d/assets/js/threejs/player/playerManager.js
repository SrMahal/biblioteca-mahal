import { createPlayerState } from './playerState.js';
import { createPlayerModel } from './playerModel.js';
import { createPlayerController } from './playerController.js';
import { createPlayerPhysics } from './playerPhysics.js';

export function createLocalPlayer({
    scene,
    camera,
    colliders = [],
    mobileInput = null,
    getCameraYaw
}) {
    const playerState =
        createPlayerState("local");

    const playerModel =
        createPlayerModel({
            scene
        });

    const playerPhysics =
        createPlayerPhysics({
            playerState,
            playerModel,
            colliders
        });

    const controller =
        createPlayerController({
            playerState,
            playerModel,
            camera,
            playerPhysics,
            mobileInput,
            getCameraYaw
        });

    return {
        state: playerState,
        model: playerModel,
        controller,
        physics: playerPhysics
    };
}
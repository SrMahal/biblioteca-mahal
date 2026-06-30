import { createPlayerState } from './playerState.js';
import { createPlayerModel } from './playerModel.js';
import { createPlayerController } from './playerController.js';

export function createLocalPlayer({
    scene,
    camera,
    mobileInput = null,
    getCameraYaw
}) {
    const playerState =
        createPlayerState("local");

    const playerModel =
        createPlayerModel({
            scene
        });

    const controller =
        createPlayerController({
            playerState,
            playerModel,
            camera,
            mobileInput,
            getCameraYaw
        });

    return {
        state: playerState,
        model: playerModel,
        controller
    };
}
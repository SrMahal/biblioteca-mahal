import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

export function createPlayerModel({ scene }) {
    const group = new THREE.Group();
    scene.add(group);

    const player = {
        group,
        model: null,
        mixer: null,
        actions: {},
        currentAction: null,

        playAnimation(name) {
            const nextAction = this.actions[name];

            if (!nextAction) return;
            if (this.currentAction === nextAction) return;

            if (this.currentAction) {
                this.currentAction.stop();
            }

            nextAction.reset();
            nextAction.time = 0;
            nextAction.enabled = true;
            nextAction.setEffectiveWeight(1);
            nextAction.setEffectiveTimeScale(1);
            nextAction.play();

            this.currentAction = nextAction;
        },

        update(deltaTime) {
            if (this.mixer) {
                this.mixer.update(deltaTime);
            }
        }
    };

    function makeClipByFrames(originalClip, name, startFrame, endFrame, fps = 24) {
        const startTime = startFrame / fps;
        const endTime = endFrame / fps;

        const tracks = [];

        originalClip.tracks.forEach((track) => {
            const times = [];
            const values = [];

            const valueSize = track.getValueSize();

            for (let i = 0; i < track.times.length; i++) {
                const time = track.times[i];

                if (time >= startTime && time <= endTime) {
                    times.push(time - startTime);

                    for (let j = 0; j < valueSize; j++) {
                        values.push(track.values[i * valueSize + j]);
                    }
                }
            }

            if (times.length > 0) {
                const TrackType = track.constructor;

                tracks.push(
                    new TrackType(
                        track.name,
                        times,
                        values
                    )
                );
            }
        });

        const duration = endTime - startTime;

        return new THREE.AnimationClip(
            name,
            duration,
            tracks
        );
    }

    const loader = new GLTFLoader();

    loader.load(
        "/biblioteca3d/assets/js/threejs/model3d/avatar.glb",

        (gltf) => {
            const model = gltf.scene;

            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                }
            });

            group.add(model);

            player.model = model;
            player.mixer = new THREE.AnimationMixer(model);

            const originalClip = gltf.animations[0];

            console.log("Clip original:", originalClip);
            console.log("Duração original:", originalClip.duration);
            console.log("FPS estimado 24");

            const idleClip = makeClipByFrames(originalClip, "Idle", 52, 80, 24);
            const walkClip = makeClipByFrames(originalClip, "Walk", 4, 21, 24);
            const runClip = makeClipByFrames(originalClip, "Run", 27, 47, 24);
            const jumpClip = makeClipByFrames(originalClip, "Jump", 361, 379, 24);

            player.actions.Idle = player.mixer.clipAction(idleClip);
            player.actions.Walk = player.mixer.clipAction(walkClip);
            player.actions.Run = player.mixer.clipAction(runClip);
            player.actions.Jump = player.mixer.clipAction(jumpClip);

            Object.values(player.actions).forEach((action) => {
                action.enabled = true;
                action.clampWhenFinished = false;
                action.setLoop(THREE.LoopRepeat, Infinity);
            });

            player.playAnimation("Idle");

            console.log("Avatar carregado");
            console.log("Ações:", player.actions);
        },

        undefined,

        (error) => {
            console.error("Erro ao carregar avatar:", error);
        }
    );

    return player;
}
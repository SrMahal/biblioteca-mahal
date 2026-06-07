/* =========================================================
  1. CONFIGURAÇÃO BASE DA CENA
  =========================================================

  A cena é o "mundo" 3D.
  Tudo que aparecer no board precisa ser adicionado dentro dela:
  chão, pontinhos, cubos, imagens, blocos de anotação etc.
*/
import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";
export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    return scene;
}
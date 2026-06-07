import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

function createNoteBlock({
    scene,
    renderer,
    x,
    z,
    title,
    text,
    color = '#fff2a8'
}) {

    const canvas = document.createElement('canvas');

    canvas.width = 612;
    canvas.height = 420;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 44px Arial';

    ctx.fillText(title, 36, 64);

    ctx.font = '30px Arial';
    ctx.fillStyle = '#333333';

    const lines = text.split('\n');

    lines.forEach((line, index) => {
        ctx.fillText(
            line,
            36,
            120 + index * 36
        );
    });

    const texture =
        new THREE.CanvasTexture(canvas);

    texture.anisotropy =
        renderer.capabilities.getMaxAnisotropy();

    const geometry =
        new THREE.PlaneGeometry(5.2, 3.2);

    const material =
        new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

    const note =
        new THREE.Mesh(
            geometry,
            material
        );

    note.rotation.x = -Math.PI / 2;

    note.position.set(
        x,
        0.07,
        z
    );

    scene.add(note);

    return note;
}

export function createNotes({
    scene,
    renderer
}) {

    createNoteBlock({
        scene,
        renderer,
        x: -20,
        z: -12,
        title: 'Recursos',
        text: 'Materiais para estudos\nMateriais Digitais\nBases De Dados.\nTutoriais',
        color: '#c7f9cc',
    });
    
    createNoteBlock({
        scene,
        renderer,
        x: -20,
        z: 0,
        title: 'Comunidade',
        text: 'Zonas De Silêncio\nSalas De Grupo\nOficinas.\nMentorias e Assessoria',
        color: '#c7f9cc',
    });
    
    createNoteBlock({
        scene,
        renderer,
        x: -15,
        z: 10,
        title: 'Regras',
        text: 'Silêncio\nRespeito\nPrazos\nCuidado Com Os Materiais',
        color: '#c7f9cc',
    });
    
    createNoteBlock({
        scene,
        renderer,
        x: 15,
        z: -10,
        title: 'O Que é a biblioteca?',
        text: '\nSomos uma comunidade/servidores que\nse apoiam formando uma rede p2p.\nA ideia aqui é somar em grupo!',
        color: '#fff2a8',
    });
    
    createNoteBlock({
        scene,
        renderer,
        x: 20,
        z: 0,
        title: 'Introdução a biblioteca',
        text: 'Conceito básico\nServidor vs computador\nConfigurando um servidor Linux ou VPS\nDNS vs Tunnel | Cloudflared\nNossa stack',
        color: '#fff2a8',
    });
    
    createNoteBlock({
        scene,
        renderer,
        x: 15,
        z: 10,
        title: 'Apoio Ao Estudo',
        text: 'Empréstimo De Livros\nEspaços De Estudo\nComputadores, VPS e VM\nAjuda Na Pesquisa',
        color: '#fff2a8',
    });
}
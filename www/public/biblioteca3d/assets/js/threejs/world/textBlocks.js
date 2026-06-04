import * as THREE from 'https://esm.sh/three@0.160.0';

function createTextBlock({
    scene,

    title = "Título",
    text = "Descrição aqui",

    x = 0,
    z = 0,

    width = 10,
    height = 4,

    titleColor = "#ffffff",
    textColor = "#d6d6d6",

    align = "center"
}) {

    const canvas =
        document.createElement("canvas");

    const ctx =
        canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 600;

    const centerX =
        canvas.width / 2;

    const paddingX = 120;

    ctx.fillStyle = titleColor;
    ctx.font = "bold 60px Poppins, Arial";

    ctx.textAlign = align;
    ctx.textBaseline = "top";

    ctx.fillText(
        title,
        align === "center"
            ? centerX
            : paddingX,
        70
    );

    ctx.fillStyle = textColor;

    ctx.font =
        "42px Poppins, Arial";

    const lines =
        text.split("\n");

    lines.forEach((line,index)=>{

        ctx.fillText(
            line,
            align==="center"
                ? centerX
                : paddingX,

            190 + index * 58
        );
    });

    const texture =
        new THREE.CanvasTexture(canvas);

    const geometry =
        new THREE.PlaneGeometry(
            width,
            height
        );

    const material =
        new THREE.MeshBasicMaterial({
            map:texture,
            transparent:true,
            side:THREE.DoubleSide
        });

    const plane =
        new THREE.Mesh(
            geometry,
            material
        );

    plane.rotation.x =
        -Math.PI/2;

    plane.position.set(
        x,
        0.09,
        z
    );

    scene.add(plane);

    return plane;
}

export function createTextBlocks({
    scene
}) {

    createTextBlock({
        scene,

        title:"Mahal",

        text:
            "Fundador da biblioteca\n" +
            "Infra e web.",

        x:-5,
        z:12
    });

    createTextBlock({
        scene,

        title:"Marinho",

        text:
            "Desenvolvedor PHP\n" +
            "Banco de Dados e API.",

        x:0,
        z:12
    });

    

}
import * as THREE from "/biblioteca3d/vendor/three/build/three.module.min.js";

export function createComputerScreen({
    scene,
    renderer,

    x = 0,
    y = 3,
    z = 0,

    width = 4,
    height = 2.5,

    rotationX = 0,
    rotationY = 0,
    rotationZ = 0
}) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 1024;
    canvas.height = 640;

    const ctx =
        canvas.getContext("2d");

    let input = "";

    let output = [
        "Biblioteca Beta v1.0",
        "┌─[ Visitante@blioteca-Mahal ]─[ ~/user78 ]",
        "└──╼ $ Digite 'help' para ver os comandos.█",
    ];

    const commands = {

        help:[
            "Comandos disponíveis:",
            "📁 biblioteca",
            "👥 comunidade",
            "⛓️ ssh",
        ],

        biblioteca:[
            "Folder oculta",
            "comando: arquivos"
        ],

        comunidade:[
            "Comunidade ativa",
            "comando: arquivos"
        ],

        ssh:[
            "Connection Lost⚠️"
        ],

        arquivos:[
            "SSD desconectado⚠️"
        ]
    };

    function drawTerminal(){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle="#050505";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle="#111111";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            70
        );

        ctx.fillStyle="#ff3300";
        ctx.font="bold 30px Poppins";

        ctx.fillText(
            "Biblioteca Terminal",
            40,
            45
        );

        ctx.fillStyle="#0d0d0d";

        ctx.fillRect(
            50,
            100,
            924,
            480
        );

        ctx.strokeStyle="#ff3300";
        ctx.lineWidth=3;

        ctx.strokeRect(
            50,
            100,
            924,
            480
        );

        ctx.font="24px monospace";
        ctx.fillStyle="#f1f1f1";

        let yLine=145;

        output
            .slice(-12)
            .forEach((line)=>{

                ctx.fillText(
                    line,
                    80,
                    yLine
                );

                yLine += 34;
            });

        ctx.fillStyle="#ff3300";

        ctx.fillText(
            "user$ > " + input + "_",
            80,
            540
        );

        texture.needsUpdate=true;
    }

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
            side:THREE.DoubleSide
        });

    const screen =
        new THREE.Mesh(
            geometry,
            material
        );

    screen.position.set(x,y,z);

    screen.rotation.set(
        rotationX,
        rotationY,
        rotationZ
    );

    scene.add(screen);

    drawTerminal();

    function runCommand(command){

        const cmd =
            command.trim().toLowerCase();

        output.push("> "+command);

        if(commands[cmd]){

            output.push(
                ...commands[cmd]
            );

        }else{

            output.push(
                "Comando não encontrado."
            );
        }

        input="";
        drawTerminal();
    }

    window.addEventListener(
        "keydown",
        (event)=>{

            if(event.key==="Enter"){
                runCommand(input);
                return;
            }

            if(event.key==="Backspace"){
                input=input.slice(0,-1);
                drawTerminal();
                return;
            }

            if(event.key.length===1){
                input+=event.key;
                drawTerminal();
            }
        }
    );

    const mobileInput =
        document.getElementById(
            "mobileTerminalInput"
        );



    return screen;
}
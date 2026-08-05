<?php

declare(strict_types=1);

require __DIR__.'/config.php';

header('Content-Type: application/json');

$id = trim($_POST['curso_id'] ?? '');

if ($id === '') {
    http_response_code(400);
    exit(json_encode([
        "success"=>false,
        "message"=>"Curso não informado."
    ]));
}

$curso = cursoPorId($id);

if (!$curso) {
    http_response_code(404);
    exit(json_encode([
        "success"=>false,
        "message"=>"Curso não encontrado."
    ]));
}

$arquivoZip = $downloadsDir.'/'.$curso['arquivo'];

@unlink($arquivoZip);

salvarProgresso($id,[
    "status"=>"iniciando",
    "percent"=>0,
    "downloaded"=>0,
    "total"=>0,
    "speed"=>0,
    "remaining"=>0,
    "message"=>"Iniciando download..."
]);

ignore_user_abort(true);

ob_end_clean();

header("Connection: close");
header("Content-Length: 0");

flush();

if(function_exists("fastcgi_finish_request")){
    fastcgi_finish_request();
}

$fp=fopen($arquivoZip,"wb");

$inicio=microtime(true);

$ultimoTempo=$inicio;

$ultimoBytes=0;

$curl=curl_init($curso["download"]);

curl_setopt_array($curl,[

    CURLOPT_FILE=>$fp,

    CURLOPT_FOLLOWLOCATION=>true,

    CURLOPT_TIMEOUT=>0,

    CURLOPT_CONNECTTIMEOUT=>20,

    CURLOPT_NOPROGRESS=>false,

    CURLOPT_USERAGENT=>"Biblioteca Mahal",

    CURLOPT_PROGRESSFUNCTION=>function(

        $resource,

        $download_size,

        $downloaded,

        $upload_size,

        $uploaded

    ) use(

        $id,

        &$ultimoTempo,

        &$ultimoBytes

    ){

        $agora=microtime(true);

        $tempo=max(0.001,$agora-$ultimoTempo);

        $speed=($downloaded-$ultimoBytes)/$tempo;

        $ultimoTempo=$agora;

        $ultimoBytes=$downloaded;

        $percent=0;

        if($download_size>0){

            $percent=round(($downloaded/$download_size)*100,1);

        }

        $remaining=0;

        if($speed>0){

            $remaining=($download_size-$downloaded)/$speed;

        }

        salvarProgresso($id,[

            "status"=>"baixando",

            "percent"=>$percent,

            "downloaded"=>$downloaded,

            "total"=>$download_size,

            "speed"=>$speed,

            "remaining"=>$remaining,

            "message"=>"Baixando..."

        ]);

        return 0;

    }

]);

$result=curl_exec($curl);

if(!$result){

    salvarProgresso($id,[

        "status"=>"erro",

        "percent"=>0,

        "message"=>curl_error($curl)

    ]);

    curl_close($curl);

    fclose($fp);

    exit;

}

curl_close($curl);

fclose($fp);

salvarProgresso($id,[

    "status"=>"download",

    "percent"=>100,

    "message"=>"Download concluído"

]);

echo json_encode([

    "success"=>true

]);
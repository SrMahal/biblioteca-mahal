<?php

declare(strict_types=1);

set_time_limit(0);

ini_set('display_errors', '1');
error_reporting(E_ALL);

/*
|--------------------------------------------------------------------------
| Caminhos
|--------------------------------------------------------------------------
*/

$documentRoot = $_SERVER['DOCUMENT_ROOT'];

$projectRoot = realpath($documentRoot . '/../');

$APP_COURSES = getenv('APP_COURSES_DIR');

$cursosDir = $APP_COURSES
    ? $APP_COURSES
    : $projectRoot . '/cursos';

$storageDir = $projectRoot . '/storage';

$downloadsDir = $storageDir . '/downloads';

$tempDir = $storageDir . '/temp';

$progressDir = $storageDir . '/progresso';

$locksDir = $storageDir . '/locks';

/*
|--------------------------------------------------------------------------
| Cria diretórios
|--------------------------------------------------------------------------
*/

foreach (

    [

        $cursosDir,

        $storageDir,

        $downloadsDir,

        $tempDir,

        $progressDir,

        $locksDir

    ]

    as $dir

) {

    if (!is_dir($dir)) {

        mkdir($dir,0777,true);

    }

}

/*
|--------------------------------------------------------------------------
| Catálogo
|--------------------------------------------------------------------------
*/

$CATALOGO = [

    [

        "id"=>"curso-php",

        "titulo"=>"Farm A.I",

        "categoria"=>"Programação",

        "descricao"=>"Comece seu projeto hoje.",

        "arquivo"=>"curso-php.zip",

        "download"=>"http://biblioteca.mahal.pro/produto/cursos/curso-orenacer/Ocomeco.zip",

        "destino"=>"Curso de ficar rico",

        "versao"=>"1.0.0"

    ],

    [

        "id"=>"logica",

        "titulo"=>"Lógica de Programação",

        "categoria"=>"Programação",

        "descricao"=>"Curso introdutório.",

        "arquivo"=>"logica.zip",

        "download"=>"http://biblioteca.mahal.pro/produto/cursos/curso-orenacer/parte2.zip",

        "destino"=>"Curso de Cyber Security",

        "versao"=>"1.0.0"

    ]

];

/*
|--------------------------------------------------------------------------
| Funções
|--------------------------------------------------------------------------
*/

function cursoPorId(string $id): ?array
{

    global $CATALOGO;

    foreach($CATALOGO as $curso){

        if($curso["id"]==$id){

            return $curso;

        }

    }

    return null;

}

function progressoPath(string $id): string
{

    global $progressDir;

    return $progressDir."/".$id.".json";

}

function salvarProgresso(

    string $id,

    array $dados

): void{

    file_put_contents(

        progressoPath($id),

        json_encode(

            $dados,

            JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE

        )

    );

}

function lerProgresso(string $id): array
{

    $arquivo = progressoPath($id);

    if(!file_exists($arquivo)){

        return [];

    }

    return json_decode(

        file_get_contents($arquivo),

        true

    ) ?? [];

}

function cursoInstalado(string $destino): bool
{

    global $cursosDir;

    return is_dir(

        $cursosDir."/".$destino

    );

}
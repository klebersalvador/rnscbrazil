<?php
$rootPath = realpath(__DIR__ . '/backend_php');
$zipPath = __DIR__ . '/backend_perfeito_hostinger.zip';

$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    die("Falha ao criar o arquivo ZIP.");
}

$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootPath, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::LEAVES_ONLY
);

echo "Iniciando compactação segura...\n";

foreach ($files as $name => $file) {
    if (!$file->isDir()) {
        $filePath = $file->getRealPath();
        
        // Caminho relativo dentro do zip
        $relativePath = substr($filePath, strlen($rootPath) + 1);
        
        // CORREÇÃO MÁGICA: Forçar barras normais (/) para o Linux do Hostinger entender as pastas
        $relativePath = str_replace('\\', '/', $relativePath);
        
        // Pula arquivos do git e node_modules se existirem perdidos
        if (strpos($relativePath, '.git/') !== false || strpos($relativePath, 'node_modules/') !== false) {
            continue;
        }

        $zip->addFile($filePath, 'backend_php/' . $relativePath);
    }
}

$zip->close();
echo "SUCESSO! O arquivo backend_perfeito_hostinger.zip foi gerado com barras corrigidas para Linux.\n";
?>

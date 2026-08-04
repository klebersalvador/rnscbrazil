<?php
// Arquivo de Teste/Debug para Hostinger
echo "<h1>DEBUG HOSTINGER - RNSC BRAZIL</h1>";
echo "<p style='color: green; font-weight: bold;'>Se você está vendo esta mensagem, o acesso aos arquivos está FUNCIONANDO!</p>";

echo "<h3>Diretório Atual no Servidor:</h3>";
echo "<pre>" . __DIR__ . "</pre>";

echo "<h3>Permissões da pasta atual:</h3>";
$perms = fileperms(__DIR__);
echo "<pre>" . substr(sprintf('%o', $perms), -4) . "</pre>";
if (substr(sprintf('%o', $perms), -4) !== '0755') {
    echo "<p style='color: red;'>⚠️ Atenção: As permissões da pasta deveriam ser 0755.</p>";
} else {
    echo "<p style='color: green;'>✅ Permissões de pasta parecem OK (0755).</p>";
}

echo "<h3>Informações do PHP:</h3>";
echo "Versão: " . phpversion() . "<br>";

echo "<h3>Variáveis do Servidor:</h3>";
echo "<pre>";
print_r(array(
    'HTTP_HOST' => $_SERVER['HTTP_HOST'] ?? 'N/A',
    'SERVER_NAME' => $_SERVER['SERVER_NAME'] ?? 'N/A',
    'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'N/A',
));
echo "</pre>";
?>

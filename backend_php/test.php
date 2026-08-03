<?php
require 'vendor/autoload.php';
$language = new \Symfony\Component\ExpressionLanguage\ExpressionLanguage();
$expressao = '1';
try {
    $res = $language->evaluate($expressao);
    var_dump((bool) $res);
} catch (\Exception $e) {
    echo "Erro: " . $e->getMessage();
}

<?php
$log = file_get_contents('import_test.log');
if (preg_match('/Error inserting into evento:(.*?)(?=\(Connection|$)/s', $log, $m)) {
    echo "Found Error: " . trim($m[1]) . "\n";
} else {
    echo "No error found.\n";
}

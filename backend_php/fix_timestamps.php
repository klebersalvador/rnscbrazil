<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$columns = DB::select("SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'rsnc_brazil' AND DATA_TYPE = 'timestamp'");

foreach ($columns as $col) {
    if ($col->COLUMN_NAME !== 'created_at' && $col->COLUMN_NAME !== 'updated_at') {
        echo "Converting {$col->TABLE_NAME}.{$col->COLUMN_NAME} to DATETIME...\n";
        DB::statement("ALTER TABLE `{$col->TABLE_NAME}` MODIFY COLUMN `{$col->COLUMN_NAME}` DATETIME NULL");
    }
}

echo "All timestamps converted to datetime!\n";

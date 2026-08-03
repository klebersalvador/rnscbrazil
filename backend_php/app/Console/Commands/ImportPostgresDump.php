<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ImportPostgresDump extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rsnc:import {--file= : Path to the SQL dump file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from a Postgres COPY dump into MySQL';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->option('file') ?: 'C:\xampp_8\htdocs\rsncbrazil\backup_rsncbrazil_oficial.sql';

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        $this->info("Starting data import from {$filePath}");
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $handle = fopen($filePath, "r");
        
        $currentTable = null;
        $columns = [];
        $chunk = [];
        $chunkSize = 500;
        $totalImported = 0;
        
        $copyHeaderBuffer = '';
        $inCopyHeader = false;

        while (($line = fgets($handle)) !== false) {
            $line = trim($line, "\r\n");

            // Ignore empty lines
            if (empty($line)) continue;

            // Check if it's the start of a COPY block
            if (str_starts_with($line, 'COPY public.')) {
                $inCopyHeader = true;
                $copyHeaderBuffer = $line;
            } elseif ($inCopyHeader) {
                $copyHeaderBuffer .= ' ' . $line;
            }

            if ($inCopyHeader && str_ends_with($line, 'FROM stdin;')) {
                $inCopyHeader = false;
                // Parse the accumulated header
                if (preg_match('/COPY public\.([a-zA-Z0-9_]+)\s*\((.*?)\)\s*FROM stdin;/i', $copyHeaderBuffer, $matches)) {
                    $currentTable = $matches[1];
                    $columns = array_map('trim', explode(',', $matches[2]));
                    $chunk = [];
                    $this->info("Importing table: {$currentTable}...");
                    
                    if (Schema::hasTable($currentTable)) {
                        DB::table($currentTable)->truncate();
                    } else {
                        $this->warn("Table {$currentTable} does not exist in MySQL. Skipping.");
                        $currentTable = null;
                    }
                }
                $copyHeaderBuffer = '';
                continue;
            }

            // Skip processing data if we are inside a multi-line header
            if ($inCopyHeader) {
                continue;
            }

            // Check if it's the end of a COPY block
            if ($currentTable && $line === '\.') {
                // Insert remaining records in chunk
                if (count($chunk) > 0) {
                    try {
                        DB::table($currentTable)->insert($chunk);
                        $totalImported += count($chunk);
                    } catch (\Exception $e) {
                        $this->error("Error inserting remaining into {$currentTable}. Check failed_inserts.log");
                        file_put_contents('failed_inserts.log', "Table: {$currentTable} Error: " . $e->getMessage() . "\n", FILE_APPEND);
                    }
                    $chunk = [];
                }
                $this->info("Finished table {$currentTable}.");
                $currentTable = null;
                $columns = [];
                continue;
            }

            // If we are inside a COPY block, process data
            if ($currentTable) {
                // Postgres COPY uses tabs to separate fields
                $values = explode("\t", $line);
                
                $row = [];
                foreach ($columns as $index => $col) {
                    $val = isset($values[$index]) ? $values[$index] : null;
                    
                    if ($val === '\N') {
                        $val = null;
                    } elseif ($val === 't') {
                        $val = 1;
                    } elseif ($val === 'f') {
                        $val = 0;
                    }
                    
                    // Handle empty strings where integer is expected (MySQL strict mode)
                    if ($val === '') {
                        $val = null;
                    }

                    // Handle Postgres epoch dates that are invalid in MySQL
                    if ($val && is_string($val) && (str_starts_with($val, '1969-') || str_starts_with($val, '0001-') || str_starts_with($val, '1899-'))) {
                        $val = null;
                    }
                    
                    // Handle Postgres timestamptz with microseconds and +00 offset (e.g. 2025-07-17 19:00:20.935351+00)
                    if ($val && is_string($val) && preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/', $val)) {
                        $val = substr($val, 0, 19);
                    }

                    $row[$col] = $val;
                }
                
                if (count($values) !== count($columns)) {
                    $this->warn("Skipping row in {$currentTable} due to column count mismatch (" . count($values) . " vs " . count($columns) . ")");
                    continue; // Skip invalid rows
                }
                
                $chunk[] = $row;
                
                if (count($chunk) >= $chunkSize) {
                    try {
                        DB::table($currentTable)->insert($chunk);
                        $totalImported += count($chunk);
                    } catch (\Exception $e) {
                        $this->error("Error inserting chunk into {$currentTable}. Check failed_inserts.log");
                        file_put_contents('failed_inserts.log', "Table: {$currentTable} Error: " . $e->getMessage() . "\n", FILE_APPEND);
                    }
                    $chunk = [];
                }
            }
        }

        fclose($handle);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->info("Import completed successfully! Total records imported: {$totalImported}");
        return 0;
    }
}

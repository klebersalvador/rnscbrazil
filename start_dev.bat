@echo off
echo ==========================================
echo    Iniciando Servidores de Desenvolvimento
echo ==========================================

echo.
echo Iniciando Laravel Backend...
start "Laravel Backend" cmd /k "cd /d %~dp0backend_php && php artisan serve"

echo.
echo Iniciando React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0frontend_new && npm run dev"

echo.
echo Servidores iniciados em novas janelas!
pause

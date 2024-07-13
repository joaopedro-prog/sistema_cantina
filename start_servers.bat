@echo off

REM Verifica se o Python está instalado
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Iniciando o servidor Python...
    start python server.py
) else (
    echo Python não encontrado. Certifique-se de tê-lo instalado.
)

REM Verifica se o Node.js está instalado
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Iniciando o servidor Node.js...
    start node server.js
) else (
    echo Node.js não encontrado. Certifique-se de tê-lo instalado.
)

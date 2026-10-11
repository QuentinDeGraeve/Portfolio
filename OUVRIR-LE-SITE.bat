@echo off
:: Lance un serveur HTTP local sur le port 8080 puis ouvre le site dans le navigateur.
:: Un serveur HTTP est nécessaire car les cartes projet sont chargées dynamiquement
:: (fetch vers des fichiers locaux est bloqué par la politique Same-Origin en file://).

set PORT=8080

:: Vérifie si Python est disponible
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON=python
) else (
    py --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON=py
    ) else (
        echo Python n'est pas installe sur ce poste.
        echo Installez Python depuis https://www.python.org puis relancez ce fichier.
        pause
        exit /b 1
    )
)

:: Ouvre le navigateur après un court délai (laisse le serveur démarrer)
start "" /b cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:%PORT%"

:: Se place dans le dossier du script puis lance le serveur (bloquant jusqu'à Ctrl+C)
cd /d "%~dp0"
echo Serveur demarré sur http://localhost:%PORT%
echo Fermez cette fenetre pour arreter le serveur.
%PYTHON% -m http.server %PORT%

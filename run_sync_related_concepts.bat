@echo off
setlocal

where python >nul 2>nul
if errorlevel 1 (
  echo Python 3 was not found in PATH.
  echo Please install Python 3, or run the .py file manually with your Python executable.
  pause
  exit /b 1
)

set "SCRIPT_DIR=%~dp0"

if "%~1"=="" (
  python "%SCRIPT_DIR%sync_related_concepts.py" . --backup
) else (
  python "%SCRIPT_DIR%sync_related_concepts.py" %* --backup
)

if errorlevel 1 (
  echo.
  echo The script did not finish successfully.
  pause
  exit /b 1
)

echo.
echo Done.
pause

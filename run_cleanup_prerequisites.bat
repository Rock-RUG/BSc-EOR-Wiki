@echo off
setlocal
cd /d "%~dp0"

set "TARGET=."
if not "%~1"=="" set "TARGET=%~1"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 cleanup_prerequisites.py "%TARGET%" --report-json "_prereq_cleanup_report\report.json"
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  python cleanup_prerequisites.py "%TARGET%" --report-json "_prereq_cleanup_report\report.json"
  goto :end
)

where python3 >nul 2>nul
if %errorlevel%==0 (
  python3 cleanup_prerequisites.py "%TARGET%" --report-json "_prereq_cleanup_report\report.json"
  goto :end
)

echo Python was not found.
echo Please install Python 3 first, then run this file again.
exit /b 1

:end
echo.
echo Done.
pause

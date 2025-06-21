@echo off
title Setup for Funker Optimizer

echo ==========================
echo  Funker Optimizer - Setup
echo ==========================
echo.
echo This script will install packages from the requirements.txt
echo.
pip install -r requirements.txt
echo.
echo Installation packages are done
echo The window will automatically closes by itself
pause
exit /b
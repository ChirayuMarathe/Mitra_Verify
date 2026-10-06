@echo off
title MitraVerify Backend Service
cd /d "%~dp0backend"
echo Starting MitraVerify Backend Server on port 5001...
python -u app.py
pause

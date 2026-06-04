@echo off
echo ===================================================
echo Setting up Flavor Finder Local Environment
echo ===================================================

echo.
echo [1/2] Installing Python dependencies in venv...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    echo Python dependencies installed successfully!
) else (
    echo WARNING: venv/Scripts/activate.bat not found. Please create a virtual environment first:
    echo   python -m venv venv
)

echo.
echo [2/2] Installing Frontend dependencies...
where bun >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Found Bun. Installing dependencies using Bun...
    bun install
) else (
    echo Bun not found. Falling back to npm...
    npm install
)

echo.
echo ===================================================
echo Setup complete! To start the project locally:
echo.
echo For Frontend (dev server):
echo   bun run dev   OR   npm run dev
echo ===================================================
pause

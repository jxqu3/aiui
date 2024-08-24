@echo off
echo "Installing/Updating requirements. If this fails, install NPM."
call npm install
echo "Running on port 5173..."
call npm run dev --host
pause
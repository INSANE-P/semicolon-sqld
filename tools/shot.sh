#!/bin/bash
# 서버 없이 file:// 로 열어 화면을 찍는다. tools/shot.sh <해시경로> <출력.png> [폭] [높이]
B="/c/Program Files/Google/Chrome/Application/chrome.exe"; [ -f "$B" ] || B="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
ROOT="$(cd "$(dirname "$0")/.." && pwd -W)"
"$B" --headless=new --disable-gpu --hide-scrollbars --no-first-run --user-data-dir="$TEMP/sqld-shot-profile" --window-size="${3:-1280},${4:-2400}" --virtual-time-budget=4000 --screenshot="$(cygpath -w "$2")" "file:///$ROOT/index.html$1" 2>&1 | grep -v -E "DevTools|bytes written|^$" | head -5

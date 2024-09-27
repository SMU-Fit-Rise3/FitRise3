#!/bin/bash

# Xvfb 시작
Xvfb :99 -screen 0 1024x768x24 &

# DISPLAY 환경 변수 설정
export DISPLAY=:99

# 애플리케이션 실행
exec "$@"

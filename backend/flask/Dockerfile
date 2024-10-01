FROM python:3.9-slim

# 시스템 의존성 설치 (libGL 및 GLib 포함)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/flask

COPY ./AnimatedDrawings ./AnimatedDrawings
COPY ./.env ./requirements.txt ./server.py .

RUN pip install -r requirements.txt

# Xvfb를 실행하는 스크립트 추가
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# ENTRYPOINT로 스크립트 실행
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["gunicorn", "-b", "0.0.0.0:5000", "-k", "eventlet", "server:app"]

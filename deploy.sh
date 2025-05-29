#! /bin/bash

# 도커 이미지 빌드
docker compose up -d --build

# 무중단 배포 실행
docker exec nextjs pm2 reload all

# 도커 빌드 캐시 삭제
docker builder prune -f

# 도커 이미지 삭제
docker image prune -f

echo "배포 완료"
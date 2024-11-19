#!/bin/bash
echo "빌드 시작..."
npm run build
echo "빌드 완료. 파일 이동 중..."
sudo rm -rf /var/www/react-app/*
sudo cp -r build/* /var/www/react-app/
sudo chown -R www-data:www-data /var/www/react-app
sudo chmod -R 755 /var/www/react-app
echo "파일 이동 완료. Nginx 재시작..."
sudo systemctl restart nginx
echo "React 배포 완료!"

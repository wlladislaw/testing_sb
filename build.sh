#!/bin/bash

   docker build -t test-app-backend ./backend

   docker run -d -p 3000:3000 --name sb-backend test-app-backend

   docker build -t test-app-frontend ./frontend

   docker run -d -p 8080:80 --name sb-frontend test-app-frontend

echo "app is running on:"
echo "front- http://localhost:8080"
echo "back- http://localhost:3000"

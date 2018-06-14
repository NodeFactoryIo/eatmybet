#!/usr/bin/env bash
set -e;

IMAGE_NAMESPACE=nodefactory
IMAGE_NAME=eatmybet

echo ""
echo "---|> Login to docker"
echo ""
docker login -u ${DOCKER_USER} -p ${DOCKER_PASSWORD}

echo ""
echo "---|> Updating images"
echo ""
docker-compose -f /home/deploy/eatmybet/docker-compose.${ENVIRONMENT}.yml  pull --ignore-pull-failures

echo ""
echo "---|> Cleaning docker environment"
echo ""
DANGLING_IMAGES=$(docker images | grep $IMAGE_NAMESPACE/$IMAGE_NAME | grep time- | awk '{print $2}' | sed -En 's/time-(.+)/\1/p' | sort -gr | tail -n+3 | sed -En 's/(.*)/time-\1/p' | paste -sd "|" -)

if [ -z "$DANGLING_IMAGES" ]
then
    echo "No dangling images to remove"
else
    echo "Removing: \$DANGLING_IMAGES"
    docker rmi --force $(docker images | grep -E "$DANGLING_IMAGES" | awk '{print $3}')
fi

echo "Running garbage collector"
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc spotify/docker-gc

echo ""
echo "---|> Restarting services"
echo ""
docker-compose -f /home/deploy/eatmybet/docker-compose.${ENVIRONMENT}.yml up -d

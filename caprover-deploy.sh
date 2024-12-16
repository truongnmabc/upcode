#!/bin/bash
START_TIME=$(date +%s)
REDEPLOY=$2

echo $REDEPLOY
# echo "Build app $1"
# ./build.sh $1

rm -rf .next
envFile="./temp-env"
nextFile="./temp-next"
deployFile="./deploy.tar"

yarn build
cp -a .next $nextFile
cp .env.local $envFile
tar -zcvf $deployFile --exclude='node_modules' --exclude='.next' ./*
if [[ $REDEPLOY =~ "true" ]]; then
    caprover deploy -t $deployFile -d
else 
    caprover deploy -t $deployFile
fi
rm -rf $envFile
rm -rf $nextFile
rm -rf $deployFile

END_TIME=$(date +%s)
echo "It took $(($END_TIME - $START_TIME))s"
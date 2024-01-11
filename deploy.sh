deploy() {
    appName=$1
    if [ -z "$appName" ]; then
        folder="passemall"
    else 
        folder=$appName
    fi
    echo "Deploying... $folder"
    git checkout -- ./
    git pull --rebase origin master
    ./build.sh $appName
    yarn
    yarn build
    echo "Building..."
    pm2 restart $folder
    echo "Deployed $folder"
}

deploy $1
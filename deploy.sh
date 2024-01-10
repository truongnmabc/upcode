# deploy() {
#     app=$1
#     echo "Deploying $app"
#     git branch -D $app
#     git checkout -b $app
#     ./build.sh $app
#     git add .
#     now=$(date +"%T")
#     git commit -m "deploy $app at $now"
#     git push $app $app -f
#     git checkout app
# }
# app=$1
# branch=$(git branch --show-current)
# if [ "$branch" = "app" ]; then
#     deploy $app
# else
#     echo "Not branch app"
# fi

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
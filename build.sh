#!/bin/bash
ROOT_PATH="./public/info"
DATA_PATH="./src/data"
VERSION=$3
typeDeploy=$2
APP_INFOS_FILE="src/data/AppConfig.json"
envFile="./.env.local"
downloadFile() {
    appName=$1
    . $envFile
      
    url="http://localhost:3001/api/app/config/get-all-web-config?bucket=$appName"
    response=$(curl -s -X GET "$url")
    echo "$response" > "$DATA_PATH/appInfos.json"
    node -e "const  {genDataFunc}  = require('./gen-data.js'); genDataFunc($response, '$NEXT_PUBLIC_WORDPRESS_API_URL', '$NEXT_PUBLIC_WEB_PROD');"
}

genConfigApp() {
    appId=$1
    googleVerifyId=$2
    appName=$3
    mainColor=$4
    mainBackgroundColor=$5
    GA4ID=$6
    mainColorBold=$7
    appleClientId=$8
    fileConfig="./src/config_app.js"
    > $fileConfig
    . $envFile
    echo 'export const APP_NEW_DOMAIN = '$appId';' >>$fileConfig
    echo 'export const APP_SHORT_NAME = "'$appName'";' >>$fileConfig
    echo 'export const VERSION = "'$VERSION'";' >>$fileConfig
    echo 'export const GOOGLE_SITE_VERIFICATION = '$googleVerifyId';' >>$fileConfig
    echo 'export const MAIN_COLOR = '$mainColor';' >>$fileConfig
    echo 'export const MAIN_COLOR_BOLD = '$mainColorBold';' >>$fileConfig
    echo 'export const MAIN_BACKGROUND_COLOR = '$mainBackgroundColor';' >>$fileConfig
    timeBuild=`date +%s000`
    echo 'export const TIME_BUILD = '$timeBuild';' >>$fileConfig 
    echo 'export const APPLE_CLIENT_ID = '$appleClientId';' >>$fileConfig
    if [[ "$NEXT_PUBLIC_WEB_PROD" == 'production' ]]; then
        echo 'export const GA4_ID = '$GA4ID';' >>$fileConfig
    else
        echo 'export const GA4_ID = "G-LTT5WBKQ7T";' >>$fileConfig
    fi
      echo 'export const WORDPRESS_DOMAIN = '$wordpressDomain';' >>$fileConfig

}

genConfigCssApp(){
    mainCss=$1
    mainBackgroundColor=$2
    mainCssBold=$3
    appName=$4
    cookie=$5
    bgColorStartTest=$6
    bgColorCloseCookie=$7
    mainColorUpgradePro=$8
    colorClockDiscount=$9
    fileConfig="./src/styles/config.css"
    > $fileConfig
    echo ':root {' >>$fileConfig
    echo "     --main-color: $(echo $mainCss | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --main-color-bold: $(echo $mainColorBold | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --main-background-color: $(echo $mainBackgroundColor | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --cookie: $(echo $cookie | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --bg-color-start-test: $(echo $bgColorStartTest | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --bg-color-close-cookie: $(echo $bgColorCloseCookie | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --main-color-upgrade-pro: $(echo $mainColorUpgradePro | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    echo "     --color-clock-discount: $(echo $colorClockDiscount | sed 's/[^a-zA-Z0-9#]//g');" >>$fileConfig
    
    if [[ "$appName" == "healthcare" ]]; then
        echo "      --header-color: #fff;" >>$fileConfig
    fi
    echo '}' >>$fileConfig
}

deploy() {
    appName=$1
    . $envFile
    rm $envFile
    echo "NEXT_PUBLIC_GOOGLE_ID=792314426707-gp1p1ml492uqehflmnm96r6in0jait6n.apps.googleusercontent.com" >>$envFile 
    if [ -z "$NEXT_PUBLIC_WEB_PROD" ]; then
        echo 'NEXT_PUBLIC_WEB_PROD="development"' >>$envFile 
    else
         echo "NEXT_PUBLIC_WEB_PROD=$NEXT_PUBLIC_WEB_PROD" >>$envFile 
    fi

    if [ -z "$appName" ] || [ "$appName" == "passemall" ]; then
        wpDomain=`jq .default.wpDomain $APP_INFOS_FILE`
    else
        wpDomain=`jq .$appName.wpDomain $APP_INFOS_FILE`
    fi
    echo "NEXT_PUBLIC_WORDPRESS_API_URL=$wpDomain" >>$envFile 
    echo 'NEXT_PUBLIC_SECRET_KEY="ABCElearning2022"' >>$envFile
   
    echo "building $1 version : $VERSION"
    if [ -z "$appName" ] || [ "$appName" == "passemall" ]; then
        appId=false
        googleVerifyId=`jq .default.googleVerifyId  $APP_INFOS_FILE`
        mainColor=`jq .default.mainColor  $APP_INFOS_FILE`
        mainColorBold=`jq .default.mainColorBold  $APP_INFOS_FILE`
        mainBackgroundColor=`jq .default.mainBackgroundColor  $APP_INFOS_FILE`
        GA4ID=`jq .default.GA4ID  $APP_INFOS_FILE`
        pageId=`jq .default.pageId  $APP_INFOS_FILE`
        wordpressDomain=`jq .default.wpDomain  $APP_INFOS_FILE`
        cookie=`jq .default.cookie $APP_INFOS_FILE`
        bgColorStartTest=`jq .default.bgColorStartTest $APP_INFOS_FILE`
        mainColorUpgradePro=`jq .default.mainColorUpgradePro $APP_INFOS_FILE`
        bgColorCloseCookie=`jq .default.bgColorCloseCookie $APP_INFOS_FILE`
        appleClientId=`jq .default.appleClientId $APP_INFOS_FILE`
    else
        appId=`jq .$appName.appId $APP_INFOS_FILE`
        googleVerifyId=`jq .$appName.googleVerifyId  $APP_INFOS_FILE`
        mainColor=`jq .$appName.mainColor  $APP_INFOS_FILE`
        mainColorBold=`jq .$appName.mainColorBold  $APP_INFOS_FILE`
        mainBackgroundColor=`jq .$appName.mainBackgroundColor  $APP_INFOS_FILE`
        GA4ID=`jq .$appName.GA4ID  $APP_INFOS_FILE`
        pageId=`jq .$appName.pageId  $APP_INFOS_FILE`
        wordpressDomain=`jq .$appName.wpDomain  $APP_INFOS_FILE`
        cookie=`jq .$appName.cookie $APP_INFOS_FILE`
        bgColorStartTest=`jq .$appName.bgColorStartTest $APP_INFOS_FILE`
        bgColorCloseCookie=`jq .$appName.bgColorCloseCookie $APP_INFOS_FILE`
        upgradeProMainColor=`jq .$appName.upgradeProMainColor $APP_INFOS_FILE`
        mainColorUpgradePro=`jq .$appName.mainColorUpgradePro $APP_INFOS_FILE`
        colorClockDiscount=`jq .$appName.colorClockDiscount $APP_INFOS_FILE`
        appleClientId=`jq .$appName.appleClientId $APP_INFOS_FILE`
    fi

    if [ "$appName" == "cdl" ]; then
        echo "MYSQL_HOST=localhost" >>$envFile 
        echo "MYSQL_DATABASE=cdl_prep" >>$envFile 
        echo "MYSQL_USER=root" >>$envFile 
        echo "MYSQL_PASSWORD=K001_S0ft" >>$envFile 
    fi
     
    if [ -z "$appName" ]  || [ "$appName" == "passemall" ];
    then
        appName="passemall"
        appPath=""
        logoPath="main"
    else
        logoPath=$appName
        appPath="-$appName"
    fi
    cp -r "$ROOT_PATH/images/$logoPath/logo60.png" "$ROOT_PATH/images/logo60.png"
    cp -r "$ROOT_PATH/images/$logoPath/logo192.png" "$ROOT_PATH/images/logo192.png"
    cp -r "$ROOT_PATH/images/$logoPath/logo512.png" "$ROOT_PATH/images/logo512.png"
    genConfigApp $appId $googleVerifyId $appName $mainColor $mainBackgroundColor $GA4ID $mainColorBold $appleClientId
    genConfigCssApp $mainColor $mainBackgroundColor $mainColorBold $appName $cookie $bgColorStartTest $bgColorCloseCookie $mainColorUpgradePro $colorClockDiscount 
    downloadFile $appName
    # yarn build
}

deploy $1

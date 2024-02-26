if [[ -e build.zip ]]; then
    rm -rf build-easyprep.zip
fi
yarn
yarn build
rm -rf build-easyprep.zip
zip -r build-easyprep.zip .next
gcloud compute scp --project="micro-enigma-235001" --zone="us-central1-a" --recurse ./build.zip passemall-home:/home/hiepnx27_gmail_com
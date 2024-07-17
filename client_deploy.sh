rm -rf .next
if [[ -e build.zip ]]; then
    rm -rf build.zip
fi
yarn
yarn build
# cần build trước (chú ý sửa file env thành production)
zip -r build.zip .next
gcloud compute scp --project="micro-enigma-235001" --zone="us-central1-a" --recurse ./build.zip passemall:/home/sonvh_w_gmail_com
rm -rf build.zip

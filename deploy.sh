if [[ -e build-easyprep.zip ]]; then
    rm -rf build-easyprep.zip
fi
# yarn
# yarn build
# cần build trước (chú ý sửa file env thành production)
zip -r build-easyprep.zip .next
gcloud compute scp --project="micro-enigma-235001" --zone="us-central1-a" --recurse ./build-easyprep.zip passemall-home:/home/sonvh_w_gmail_com
rm -rf build-easyprep.zip
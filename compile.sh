#!/bin/bash
ionic cordova build --production --release android --device
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass tU/x@168rY -keystore ~/.ssh/my-release-key.keystore /Users/den/Documents/khmernewslocal_ionic3/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
rm KhmerNewsLocal.apk
zipalign -v 4 /Users/den/Documents/khmernewslocal_ionic3/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./KhmerNewsLocal.apk
adb uninstall com.khmernewslocal.app
adb install -r KhmerNewsLocal.apk
adb shell monkey -p com.khmernewslocal.app -c android.intent.category.LAUNCHER 1

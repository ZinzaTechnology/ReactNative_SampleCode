# OpenRoad App

```
$ nvm install v10.17.0

$ cd opr-mobile
$ npm install
$ react-native link
$ cd ios && pod install
$ cd ..
$ react-native run-ios
$ react-native run-android
```

## Others
### RNFS
"react-native-fs": "2.15.2"
### Fix XCode 11 build
https://github.com/facebook/react-native/pull/25146/files#diff-263fc157dfce55895cdc16495b55d190

### Fix status bar (iOS13 - dark mode)
https://github.com/facebook/react-native/issues/26619#issuecomment-536813690
Replace content of RCTStatusBarManager.m with this file (https://raw.githubusercontent.com/facebook/react-native/796b3a1f8823c87c9a066ea9c51244710dc0b9b5/React/Modules/RCTStatusBarManager.m)


### End
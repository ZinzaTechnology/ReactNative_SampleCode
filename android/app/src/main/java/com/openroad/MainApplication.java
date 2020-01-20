package com.openroad;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.rnfs.RNFSPackage;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;

import com.guichaguri.trackplayer.TrackPlayer;
import com.imagepicker.ImagePickerPackage;
import com.taluttasgiran.rnsecurestorage.RNSecureStoragePackage;

import io.realm.react.RealmReactPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import android.support.multidex.MultiDex;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNDeviceInfo(),
                    new NetInfoPackage(),
                    new SplashScreenReactPackage(),
                    new RNExitAppPackage(),
                    new RNFSPackage(),
                    new ExtraDimensionsPackage(),
                    new TrackPlayer(),
                    new ImagePickerPackage(),
                    new RNSecureStoragePackage(),
                    new VectorIconsPackage(),
                    new LinearGradientPackage(),
                    new FastImageViewPackage(),
                    new RNGestureHandlerPackage(),
                    new RealmReactPackage(),
                    new ReanimatedPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        MultiDex.install(this);
    }
}

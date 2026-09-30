package com.reelinsights.editor;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebView;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme_NoActionBar);
        super.onCreate(savedInstanceState);

        final int darkBg = Color.parseColor("#0d0f12");

        Window window = getWindow();

        // 1. Ensure window and decor view backgrounds are strictly the app dark color (#0d0f12)
        window.setBackgroundDrawable(new ColorDrawable(darkBg));
        window.getDecorView().setBackgroundColor(darkBg);

        // 2. Set status bar and navigation bar colors to the dark app background
        window.setStatusBarColor(darkBg);
        window.setNavigationBarColor(darkBg);

        // 3. Allow edge-to-edge layout so dark background visually continues behind system bars
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 4. Disable contrast enforcement scrim on Android 10+ (API 29+) to eliminate any gray/light overlay
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 5. Ensure system bar icons (clock, battery, Wi-Fi, and navigation gesture pill) are crisp white
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightNavigationBars(false); // false = white navigation pill
            insetsController.setAppearanceLightStatusBars(false);     // false = white status bar icons
        }

        // 6. Ensure WebView background is #0d0f12
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(darkBg);
        }
    }
}


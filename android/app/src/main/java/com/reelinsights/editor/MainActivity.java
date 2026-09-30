package com.reelinsights.editor;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int DARK_BG = Color.parseColor("#0d0f12");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        applyDarkSystemBars();
    }

    @Override
    public void onResume() {
        super.onResume();
        applyDarkSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyDarkSystemBars();
        }
    }

    private void applyDarkSystemBars() {
        Window window = getWindow();
        if (window == null) return;

        // 1. Enable Edge-to-Edge: allow content to draw behind system bars (status bar and navigation bar)
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 2. Set window and decor view background to app dark color
        window.setBackgroundDrawable(new ColorDrawable(DARK_BG));
        if (window.getDecorView() != null) {
            window.getDecorView().setBackgroundColor(DARK_BG);
        }

        // 3. Ensure system bars draw with transparent background for edge-to-edge
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

        // 4. Transparent system bars so dark app background extends continuously
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 5. Disable Android 10+ contrast scrim overlay so system bars don't get forced white/gray
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 6. Ensure system icons (clock, battery, Wi-Fi, navigation gesture pill / buttons) are white
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(false);       // false = light/white icons
            insetsController.setAppearanceLightNavigationBars(false);   // false = light/white navigation icons
        }

        // 7. Ensure underlying WebView has the same dark background
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(DARK_BG);
        }
    }
}

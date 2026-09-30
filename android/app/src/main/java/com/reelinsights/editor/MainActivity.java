package com.reelinsights.editor;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
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
        applyEdgeToEdgeDarkBars();
    }

    @Override
    public void onResume() {
        super.onResume();
        applyEdgeToEdgeDarkBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyEdgeToEdgeDarkBars();
        }
    }

    private void applyEdgeToEdgeDarkBars() {
        Window window = getWindow();
        if (window == null) return;

        // 1. Enable true edge-to-edge layout so app background extends to physical top and bottom
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 2. Set window and decor view background to app dark color (#0d0f12)
        window.setBackgroundDrawable(new ColorDrawable(DARK_BG));
        View decorView = window.getDecorView();
        if (decorView != null) {
            decorView.setBackgroundColor(DARK_BG);
        }

        // 3. Ensure system bars draw over the window background with full transparency (no gray/white strip)
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 4. Disable Android 10+ contrast scrim overlay so system bars don't get forced gray/white
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 5. Ensure system icons (clock, battery, Wi-Fi, navigation gesture pill / buttons) are white
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, decorView != null ? decorView : window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(false);       // false = light/white text & icons on dark status bar
            insetsController.setAppearanceLightNavigationBars(false);   // false = light/white navigation icons
        }

        // 6. Ensure underlying WebView has the same dark background
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(DARK_BG);
        }
    }
}

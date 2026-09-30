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
        configureEdgeToEdge();
    }

    @Override
    public void onResume() {
        super.onResume();
        configureEdgeToEdge();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            configureEdgeToEdge();
        }
    }

    private void configureEdgeToEdge() {
        Window window = getWindow();
        if (window == null) return;

        // 1. Enable Edge-to-Edge: content extends behind status bar and navigation bar
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 2. Extend into display cutouts / camera notch on Android 9+ (API 28+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams params = window.getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            window.setAttributes(params);
        }

        // 3. Set window and decor view background to app dark color (#0d0f12)
        window.setBackgroundDrawable(new ColorDrawable(DARK_BG));
        View decorView = window.getDecorView();
        if (decorView != null) {
            decorView.setBackgroundColor(DARK_BG);
            decorView.setFitsSystemWindows(false);
            decorView.setOnApplyWindowInsetsListener((v, insets) -> insets);
        }

        // 4. Ensure system bars draw #0d0f12 / transparent for true seamless top edge
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.setStatusBarColor(DARK_BG);
        window.setNavigationBarColor(DARK_BG);

        // 5. Disable Android 10+ contrast scrim overlay so system bars don't get forced white/gray
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 6. Ensure system icons (clock, battery, Wi-Fi, navigation gesture pill / buttons) are white
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, decorView != null ? decorView : window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(false);       // false = light/white icons
            insetsController.setAppearanceLightNavigationBars(false);   // false = light/white navigation icons
        }

        // 7. Ensure underlying WebView and container have the same dark background and no system insets
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(DARK_BG);
            webView.setFitsSystemWindows(false);
            if (webView.getParent() instanceof View) {
                ((View) webView.getParent()).setBackgroundColor(DARK_BG);
                ((View) webView.getParent()).setFitsSystemWindows(false);
            }
        }
    }
}

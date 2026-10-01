package com.reelinsights.editor;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
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
    public void onStart() {
        super.onStart();
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

        // 3. Set window background to app dark color (#0d0f12)
        window.setBackgroundDrawable(new ColorDrawable(DARK_BG));

        // 4. Set system bars to fully transparent so app background flows under status & nav bars
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 5. Disable Android 10+ contrast scrim overlay so system bars don't get forced gray/scrim
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 6. Ensure system icons (clock, battery, Wi-Fi, navigation gesture pill / buttons) are white
        View decorView = window.getDecorView();
        if (decorView != null) {
            decorView.setBackgroundColor(DARK_BG);
            decorView.setFitsSystemWindows(false);
            decorView.setPadding(0, 0, 0, 0);

            // Pass insets through without applying padding
            ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> insets);

            WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, decorView);
            if (insetsController != null) {
                insetsController.setAppearanceLightStatusBars(false);       // false = light/white status bar icons
                insetsController.setAppearanceLightNavigationBars(false);   // false = light/white navigation bar icons
            }
        }

        // 7. Ensure content container and WebView start at (0, 0) with zero padding
        View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setFitsSystemWindows(false);
            contentView.setPadding(0, 0, 0, 0);
            ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, insets) -> insets);
        }

        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(DARK_BG);
            webView.setFitsSystemWindows(false);
            webView.setPadding(0, 0, 0, 0);
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> insets);

            if (webView.getParent() instanceof ViewGroup) {
                ViewGroup parent = (ViewGroup) webView.getParent();
                parent.setBackgroundColor(DARK_BG);
                parent.setFitsSystemWindows(false);
                parent.setPadding(0, 0, 0, 0);
                ViewCompat.setOnApplyWindowInsetsListener(parent, (v, insets) -> insets);
            }
        }
    }
}

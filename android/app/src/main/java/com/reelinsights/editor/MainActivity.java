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
    private static final int DARK_BG = Color.BLACK;

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

        // 2. Extend into display cutouts / camera notch on all edges (Android 11+ API 30+, fallback Android 9+ API 28+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowManager.LayoutParams params = window.getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
            window.setAttributes(params);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams params = window.getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            window.setAttributes(params);
        }

        // 3. Set window background to pure black Color.BLACK (#000000)
        window.setBackgroundDrawable(new ColorDrawable(DARK_BG));

        // 4. Enable fullscreen flags and transparent system bars
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 5. Explicitly disable Android 10+ contrast scrim overlay so system never forces a gray strip
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 6. Ensure true immersive full-screen: hide system bars and allow transient swipe reveal
        View decorView = window.getDecorView();
        if (decorView != null) {
            decorView.setBackgroundColor(DARK_BG);
            decorView.setFitsSystemWindows(false);
            decorView.setPadding(0, 0, 0, 0);

            // Backward-compatible immersive flags for Android 8 - 15
            int flags = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN;
            decorView.setSystemUiVisibility(flags);

            // Pass insets through without applying padding
            ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> insets);

            WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, decorView);
            if (insetsController != null) {
                insetsController.setAppearanceLightStatusBars(false);       // false = light/white status bar icons
                insetsController.setAppearanceLightNavigationBars(false);   // false = light/white navigation bar icons
                insetsController.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                insetsController.hide(WindowInsetsCompat.Type.systemBars());
            }
        }

        // 7. Ensure content container and WebView start at (0, 0) with zero padding and zero margins
        View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setFitsSystemWindows(false);
            contentView.setPadding(0, 0, 0, 0);
            if (contentView.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
                ((ViewGroup.MarginLayoutParams) contentView.getLayoutParams()).setMargins(0, 0, 0, 0);
            }
            ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, insets) -> insets);
        }

        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();
            webView.setBackgroundColor(DARK_BG);
            webView.setFitsSystemWindows(false);
            webView.setPadding(0, 0, 0, 0);
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            if (webView.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
                ((ViewGroup.MarginLayoutParams) webView.getLayoutParams()).setMargins(0, 0, 0, 0);
            }
            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> insets);

            if (webView.getParent() instanceof ViewGroup) {
                ViewGroup parent = (ViewGroup) webView.getParent();
                parent.setBackgroundColor(DARK_BG);
                parent.setFitsSystemWindows(false);
                parent.setPadding(0, 0, 0, 0);
                if (parent.getLayoutParams() instanceof ViewGroup.MarginLayoutParams) {
                    ((ViewGroup.MarginLayoutParams) parent.getLayoutParams()).setMargins(0, 0, 0, 0);
                }
                ViewCompat.setOnApplyWindowInsetsListener(parent, (v, insets) -> insets);
            }
        }
    }
}

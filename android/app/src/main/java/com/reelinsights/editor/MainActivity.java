package com.reelinsights.editor;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // 1. Enable edge-to-edge layout so the app background visually continues behind system bars
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // 2. Set navigation bar to transparent so the dark Reel Insights background (#0d0f12) blends completely
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 3. Set status bar transparent
        window.setStatusBarColor(Color.TRANSPARENT);

        // 4. Disable contrast enforcement scrim on Android 10+ (API 29+) to eliminate the gray strip behind gesture nav
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setNavigationBarContrastEnforced(false);
            window.setStatusBarContrastEnforced(false);
        }

        // 5. Ensure the Android system gesture pill remains light (white) on top of the dark app background
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightNavigationBars(false); // false = white navigation pill
            insetsController.setAppearanceLightStatusBars(false);     // false = white status bar icons
        }
    }
}


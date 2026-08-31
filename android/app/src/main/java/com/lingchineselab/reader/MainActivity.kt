package com.lingchineselab.reader

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.WindowManager.LayoutParams.FLAG_SECURE
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

/**
 * Thin WebView shell around the Ling Chinese Lab site whose only job is to add
 * what a browser can't: FLAG_SECURE, so screenshots/screen-recording of the
 * e-book turn black (like banking apps).
 *
 * FLAG_SECURE is toggled per page: ON only inside the reader (/read...), so on
 * the store the buyer can still screenshot the QR / bank account to pay.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    // Web <input type=file> (proof-of-payment upload) → system file/gallery picker.
    private val fileChooser = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
        filePathCallback?.onReceiveValue(uris)
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true            // localStorage: device id, bookmarks, progress
            mediaPlaybackRequiresUserGesture = false
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, req: WebResourceRequest): Boolean {
                val host = req.url.host ?: ""
                // Keep our own site inside the WebView; hand WhatsApp / tel / mailto
                // and any external host to the system apps.
                if (req.url.scheme == "https" && host.contains(SITE_HOST)) return false
                startActivity(Intent(Intent.ACTION_VIEW, req.url))
                return true
            }

            override fun onPageStarted(view: WebView, url: String?, favicon: Bitmap?) {
                applySecure(url)
            }

            override fun doUpdateVisitedHistory(view: WebView, url: String?, isReload: Boolean) {
                applySecure(url) // catches SPA route changes (react-router) without a full load
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                filePathCallback?.onReceiveValue(null)
                filePathCallback = callback
                return try {
                    fileChooser.launch(params.createIntent())
                    true
                } catch (e: Exception) {
                    filePathCallback = null
                    false
                }
            }
        }

        if (savedInstanceState == null) webView.loadUrl(START_URL)
    }

    /** Screenshot-block ON only in the reader; OFF elsewhere so QR is capturable. */
    private fun applySecure(url: String?) {
        val secure = url?.contains("/read") == true
        if (secure) window.addFlags(FLAG_SECURE) else window.clearFlags(FLAG_SECURE)
    }

    @Suppress("DEPRECATION")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    companion object {
        // The reader link is host-based, so www/apex both match.
        private const val SITE_HOST = "lingchineselab.com"
        private const val START_URL = "https://www.lingchineselab.com/"
    }
}

const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../public/template-04.html');
const fontsCssPath = path.resolve(__dirname, '../assets/fonts/template04-embedded-fonts.css');
const outputPath = path.resolve(__dirname, '../components/templates/bundledTemplate04Html.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const fontsCss = fs.readFileSync(fontsCssPath, 'utf8');

const bridgeScript = `
<script>
(function() {
  function postToNative(type, payload) {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
    }
  }
  window.__POST_TO_NATIVE__ = postToNative;

  // Notify native host that HTML DOM and bridge are live
  window.addEventListener('DOMContentLoaded', function() {
    postToNative('TEMPLATE_READY', { templateId: 'tpl-wedding-paper-palace-04', ready: true });
  });

  // Intercept INK_IVORY updates and acknowledge back
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      postToNative('INVITATION_UPDATED', { success: true, timestamp: Date.now() });
    }
  });

  // Intercept window errors to report to native
  window.addEventListener('error', function(err) {
    postToNative('RENDER_ERROR', { message: err.message, filename: err.filename, lineno: err.lineno });
  });
})();
</script>
`;

let finalHtml = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet">/i, '<style>' + fontsCss + '</style>');
finalHtml = finalHtml.replace('</head>', bridgeScript + '</head>');

const jsModule = 'export const TEMPLATE_04_BUNDLED_HTML = ' + JSON.stringify(finalHtml) + ';\n';
fs.writeFileSync(outputPath, jsModule);
console.log('Successfully bundled Template 04 HTML into module. Size:', jsModule.length);

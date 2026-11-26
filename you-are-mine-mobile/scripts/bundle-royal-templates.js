const fs = require('fs');
const path = require('path');

const fontsDir = path.resolve(__dirname, '../assets/fonts');
const publicDir = path.resolve(__dirname, '../../public');
const outputDir = path.resolve(__dirname, '../components/templates');

// Read font files
const gvBase64 = fs.readFileSync(path.join(fontsDir, 'GreatVibes-Regular.ttf')).toString('base64');
const cgRegBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Regular.ttf')).toString('base64');
const cgBoldBase64 = fs.readFileSync(path.join(fontsDir, 'CormorantGaramond-Bold.ttf')).toString('base64');
const b2Base64 = fs.readFileSync(path.join(fontsDir, 'Baloo2-Bold.ttf')).toString('base64');
const cinzelBase64 = fs.readFileSync(path.join(fontsDir, 'CinzelDecorative-Bold.ttf')).toString('base64');
const playfairBase64 = fs.readFileSync(path.join(fontsDir, 'PlayfairDisplay-Regular.ttf')).toString('base64');

const sharedFontFaces = `
@font-face {
  font-family: 'Great Vibes';
  src: url('data:font/ttf;base64,${gvBase64}') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgRegBase64}') format('truetype');
  font-weight: 400 500;
  font-style: normal;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('data:font/ttf;base64,${cgBoldBase64}') format('truetype');
  font-weight: 600 700;
  font-style: normal;
}
@font-face {
  font-family: 'Baloo 2';
  src: url('data:font/ttf;base64,${b2Base64}') format('truetype');
  font-weight: 500 700;
  font-style: normal;
}
@font-face {
  font-family: 'Cinzel Decorative';
  src: url('data:font/ttf;base64,${cinzelBase64}') format('truetype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Playfair Display';
  src: url('data:font/ttf;base64,${playfairBase64}') format('truetype');
  font-weight: 400 700;
  font-style: normal;
}
`;

function createBridgeScript(templateId) {
  return `
<script>
(function() {
  function postToNative(type, payload) {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
    }
  }
  window.__POST_TO_NATIVE__ = postToNative;

  window.addEventListener('DOMContentLoaded', function() {
    postToNative('TEMPLATE_READY', { templateId: '${templateId}', ready: true });
  });

  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'INK_IVORY_CUSTOM_UPDATE') {
      postToNative('INVITATION_UPDATED', { success: true, timestamp: Date.now() });
    }
  });

  window.addEventListener('error', function(err) {
    postToNative('RENDER_ERROR', { message: err.message, filename: err.filename, lineno: err.lineno });
  });
})();
</script>
`;
}

function bundleTemplate(templateNum, templateId, exportConstName, outputFile) {
  const htmlFile = path.join(publicDir, `template-0${templateNum}.html`);
  if (!fs.existsSync(htmlFile)) {
    console.error(`Cannot find ${htmlFile}`);
    return;
  }
  let html = fs.readFileSync(htmlFile, 'utf8');

  // Replace external fonts with local embedded base64 fonts
  html = html.replace(/<link[^>]+fonts\.googleapis\.com[^>]+>/gi, '');
  html = html.replace(/<link[^>]+fonts\.gstatic\.com[^>]+>/gi, '');
  html = html.replace('<head>', '<head>\n<style>' + sharedFontFaces + '</style>\n' + createBridgeScript(templateId));

  const content = `export const ${exportConstName} = ` + JSON.stringify(html) + ';\n';
  fs.writeFileSync(path.join(outputDir, outputFile), content);
  console.log(`Successfully bundled Template 0${templateNum} (${templateId}) -> ${outputFile} (Size: ${content.length} bytes)`);
}

// Bundle Templates 02, 03, 04, 05
bundleTemplate(2, 'tpl-anniversary-gold-02', 'TEMPLATE_02_BUNDLED_HTML', 'bundledTemplate02Html.js');
bundleTemplate(3, 'tpl-wedding-temple-03', 'TEMPLATE_03_BUNDLED_HTML', 'bundledTemplate03Html.js');
bundleTemplate(4, 'tpl-wedding-paper-palace-04', 'TEMPLATE_04_BUNDLED_HTML', 'bundledTemplate04Html.js');
bundleTemplate(5, 'tpl-wedding-south-indian-05', 'TEMPLATE_05_BUNDLED_HTML', 'bundledTemplate05Html.js');

console.log('All royal celebration templates successfully packaged for offline hybrid mobile execution.');

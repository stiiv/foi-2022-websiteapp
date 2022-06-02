import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Scanner from './Scanner';

const INJECTED_JAVASCRIPT = `
  (function () {
    let div = document.createElement("div");
    div.className = "col-md-12 text-center";
    div.style.cssText = "margin-top: 5px";
  
    let btn = document.createElement("button");
    btn.innerHTML = "Scan your QR Code";
    btn.className = "btn btn-default";
    btn.onclick = function () {
      window.ReactNativeWebView.postMessage("openScanner");
    };
    div.appendChild(btn);
    document.forms[0].parentNode.insertBefore(div, document.forms[0]);
    
    window.addEventListener("message", function(e) {
      try {
        const data = JSON.parse(e.data);
        Object.keys(data).forEach(function (key) {
          if (document.getElementsByName(key).length) {
            const inputEl = document.getElementsByName(key)[0];
            inputEl.focus();
            inputEl.value = data[key];
          }
        });
      } catch (error) {
        console.warn(error);
      }
    });
  })();
`;

const MyWebsite = () => {
  const webViewRef = useRef(null);
  const [openScanner, setOpenScanner] = useState(false);

  const onMessage = (event) => {
    const webViewData = event.nativeEvent.data;
    if (webViewData !== 'openScanner') {
      return;
    }

    setOpenScanner(true);
  };

  const onData = (scannerData) => {
    console.log(scannerData);
    setOpenScanner(false);
    if (!scannerData) {
      return;
    }

    if (webViewRef.current) {
      webViewRef.current.postMessage(scannerData);
    }
  };

  return (
    <View style={styles.container}>
      <Scanner open={openScanner} onData={onData} />
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://2e-systems.com/contact' }}
        javaScriptEnabledAndroid={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={onMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyWebsite;

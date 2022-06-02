import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function ({ open, onData }) {
  const scannerRef = useRef(null);
  const onSuccess = (e) => {
    scannerRef.current.reactivate();
    if (typeof onData === 'function') {
      onData(e.data);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={open}
      onRequestClose={() => {
        scannerRef.current.reactivate();
        if (typeof onData === 'function') {
          onData(null);
        }
      }}>
      <QRCodeScanner
        ref={scannerRef}
        showMarker={true}
        onRead={onSuccess}
        bottomContent={
          <TouchableOpacity
            onPress={() => {
              scannerRef.current.reactivate();
              if (typeof onData === 'function') {
                onData(null);
              }
            }}
            style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

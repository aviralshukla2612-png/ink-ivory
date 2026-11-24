import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { Colors } from '../../constants/colors';

export default function MusicScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Curated Soundtrack" showNotification={false} />
      <View style={styles.content}>
        <Text style={styles.title}>Soundtrack Library</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, color: Colors.textPrimary },
});

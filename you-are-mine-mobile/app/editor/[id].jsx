import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Header } from '../../components/common/Header';

export default function EditorPlaceholderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Edit Invitation" showBack onBackPress={() => router.back()} showNotification={false} />
      <View style={styles.center}>
        <Text style={styles.title}>Native Invitation Editor</Text>
        <Text style={styles.subtitle}>Template ID: {id}</Text>
        <Text style={styles.note}>Ready for Milestone 4 Editor Canvas implementation.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  note: {
    fontSize: 12,
    color: Colors.champagneGold,
    marginTop: 14,
    textAlign: 'center',
  },
});

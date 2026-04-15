import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/shared/Button';
import { CATEGORIES } from '../../constants/sizes';
import { onboardingApi } from '../../api/onboarding.api';
import { useAuth } from '../../hooks/useAuth';

export function CategorySelectScreen({ navigation, route }: any) {
  const { sizes, brands } = route.params;
  const { markOnboarded } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (cat: string) => {
    const next = new Set(selected);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelected(next);
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      await onboardingApi.complete(sizes, brands, Array.from(selected));
      markOnboarded();
    } catch (err: any) {
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>What do you love?</Text>
        <Text style={styles.subtitle}>Pick your categories — or skip for all of it.</Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryTile, selected.has(cat.id) && styles.categoryTileSelected]}
            onPress={() => toggle(cat.id)}
          >
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catLabel, selected.has(cat.id) && styles.catLabelSelected]}>
              {cat.label}
            </Text>
            {selected.has(cat.id) && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Show me the deals 🔥"
          onPress={handleDone}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  step: { color: Colors.accent, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: Colors.textSecondary, fontSize: 15 },
  grid: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
  },
  categoryTileSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '15',
  },
  catEmoji: { fontSize: 26 },
  catLabel: { flex: 1, color: Colors.textSecondary, fontSize: 17, fontWeight: '500' },
  catLabelSelected: { color: Colors.accent, fontWeight: '700' },
  check: { color: Colors.accent, fontSize: 18, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/shared/Button';
import { BRANDS } from '../../constants/brands';

export function BrandSelectScreen({ navigation, route }: any) {
  const { sizes } = route.params;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (brand: string) => {
    const next = new Set(selected);
    if (next.has(brand)) next.delete(brand);
    else next.add(brand);
    setSelected(next);
  };

  const handleNext = () => {
    navigation.navigate('CategorySelect', { sizes, brands: Array.from(selected) });
  };

  const handleSkip = () => {
    navigation.navigate('CategorySelect', { sizes, brands: [] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>Favorite brands?</Text>
        <Text style={styles.subtitle}>Optional — skip to see everything.</Text>
      </View>

      <FlatList
        data={BRANDS}
        numColumns={2}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.brandTile, selected.has(item) && styles.brandTileSelected]}
            onPress={() => toggle(item)}
          >
            <Text style={[styles.brandText, selected.has(item) && styles.brandTextSelected]}>
              {item}
            </Text>
            {selected.has(item) && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleNext} />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip — show me everything</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  step: { color: Colors.accent, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: Colors.textSecondary, fontSize: 15 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  columnWrapper: { gap: 10, marginBottom: 10 },
  brandTile: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTileSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '15',
  },
  brandText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '500', flex: 1 },
  brandTextSelected: { color: Colors.accent, fontWeight: '700' },
  check: { color: Colors.accent, fontSize: 16, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  skipButton: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: Colors.textSecondary, fontSize: 14 },
});

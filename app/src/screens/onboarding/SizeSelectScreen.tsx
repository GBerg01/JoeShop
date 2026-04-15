import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/shared/Button';
import { CLOTHING_SIZES, SHOE_SIZES_US } from '../../constants/sizes';

const SIZE_GROUPS = [
  { label: 'Clothing', sizes: CLOTHING_SIZES },
  { label: 'Shoes (US)', sizes: SHOE_SIZES_US },
];

interface SizeSelectScreenProps {
  navigation: any;
  route: any;
}

export function SizeSelectScreen({ navigation }: SizeSelectScreenProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (size: string) => {
    const next = new Set(selected);
    if (next.has(size)) {
      next.delete(size);
    } else {
      next.add(size);
    }
    setSelected(next);
  };

  const handleNext = () => {
    if (selected.size === 0) {
      Alert.alert('Select a size', 'Please select at least one size to personalize your feed.');
      return;
    }
    navigation.navigate('BrandSelect', { sizes: Array.from(selected) });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>What's your size?</Text>
        <Text style={styles.subtitle}>We'll show you deals that actually fit.</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {SIZE_GROUPS.map(group => (
          <View key={group.label} style={styles.group}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            <View style={styles.chipGrid}>
              {group.sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  style={[styles.chip, selected.has(size) && styles.chipSelected]}
                  onPress={() => toggle(size)}
                >
                  <Text style={[styles.chipText, selected.has(size) && styles.chipTextSelected]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Continue (${selected.size} selected)`}
          onPress={handleNext}
          disabled={selected.size === 0}
        />
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  group: { marginBottom: 28 },
  groupLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '20',
  },
  chipText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },
  chipTextSelected: { color: Colors.accent, fontWeight: '700' },
  footer: { paddingHorizontal: 24, paddingBottom: 24 },
});

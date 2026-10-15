import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { ExerciseCategory, getAllCategories } from '../utils/exerciseCategories';

interface CategoryFilterProps {
  selectedCategory: ExerciseCategory | 'ALL';
  onSelectCategory: (category: ExerciseCategory | 'ALL') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = [
    { key: 'ALL' as const, label: '전체', emoji: '🏋️' },
    ...getAllCategories(),
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.key;

          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.chip,
                isSelected && styles.chipActive
              ]}
              onPress={() => onSelectCategory(cat.key as ExerciseCategory | 'ALL')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.chipText,
                isSelected && styles.chipTextActive
              ]}>
                {cat.emoji} {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
  },
});

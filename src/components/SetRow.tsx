import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WorkoutSet } from '../types/workout';
import { PRBadge } from './PRBadge';

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onDelete: () => void;
  isNewRecord?: boolean;
}

export const SetRow: React.FC<SetRowProps> = ({ set, index, onDelete, isNewRecord }) => {
  return (
    <View style={styles.setRow}>
      <View style={styles.setInfo}>
        <Text style={styles.setText}>
          세트 {index + 1}: {set.weight}kg × {set.reps}회
        </Text>
        <PRBadge isNewRecord={isNewRecord} />
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteButton}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  setInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  setText: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    fontSize: 24,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
});

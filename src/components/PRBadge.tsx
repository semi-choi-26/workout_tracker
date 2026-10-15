import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PRBadgeProps {
  isNewRecord?: boolean;
}

export const PRBadge: React.FC<PRBadgeProps> = ({ isNewRecord = false }) => {
  if (!isNewRecord) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>🏆 신기록!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

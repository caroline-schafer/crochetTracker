import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EmptyState({ onCreate }) {
  return (
    <View style={styles.centered}>
      <Text>No projects found.</Text>
      <View style={{ marginTop: 12 }}>
        <Button title="Create New Project" onPress={onCreate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

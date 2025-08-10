import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ProjectCard({ project, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.meta}>Status: {project.status}</Text>
        <Text style={styles.meta}>Type: {project.type || 'N/A'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 14,
    color: '#555',
  },
});

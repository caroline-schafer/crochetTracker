// Library.js
import React, { useEffect, useState } from 'react';
import { FlatList, View, Button, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import ProjectCard from '../../components/ProjectCard';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';

export default function Library() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleNewProject = () => {
    router.push('/project/new');
  };

  if (loading) return <LoadingState />;

  if (projects.length === 0) return <EmptyState onCreate={handleNewProject} />;

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Button title="Create New Project" onPress={handleNewProject} />
        </View>
      }
      renderItem={({ item }) => (
        <ProjectCard project={item} onPress={() => router.push(`/project/${item.id}`)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  header: { marginBottom: 16 },
});

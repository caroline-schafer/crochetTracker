import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../services/api';

export default function ProjectDetail() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}/`);
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const updateEditForm = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = () => {
    setEditing(true);
    setEditForm({ ...project });
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditForm({});
  };

  const saveChanges = async () => {
    try {
      await api.patch(`/projects/${project.id}/`, editForm);
      setProject(editForm);
      setEditing(false);
      setEditForm({});
      Alert.alert('Success', 'Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'Failed to update project.');
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/projects/${project.id}/`);
      Alert.alert('Deleted', 'Project removed');
      router.back();
    } catch (error) {
      console.error('Error deleting project:', error?.response?.data || error);
      Alert.alert('Error', 'Failed to delete project.');
    }
  };

  const deleteProject = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this project?')) {
        handleDeleteConfirmed();
      }
    } else {
      Alert.alert('Delete Project', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeleteConfirmed },
      ]);
    }
  };

  const renderColors = (colors) => {
    if (!colors) return '';
    if (Array.isArray(colors)) return colors.join(', ');
    if (typeof colors === 'object') return Object.values(colors).join(', ');
    return colors.toString();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centered}>
        <Text>Project not found.</Text>
      </View>
    );
  }

  const formFields = [
    { key: 'title', placeholder: 'Title' },
    { key: 'pattern_source', placeholder: 'Pattern Source' },
    { key: 'status', placeholder: 'Status' },
    { key: 'type', placeholder: 'Type' },
    { key: 'start_date', placeholder: 'Start Date (YYYY-MM-DD)' },
    { key: 'end_date', placeholder: 'End Date (YYYY-MM-DD)' },
    { key: 'hook_size', placeholder: 'Hook Size' },
    { key: 'difficulty_level', placeholder: 'Difficulty Level' },
    {
      key: 'colors',
      placeholder: 'Colors (comma separated)',
      transform: renderColors,
    },
    {
      key: 'rating',
      placeholder: 'Rating',
      keyboardType: 'numeric',
      transform: (val) => (val != null ? val.toString() : ''),
    },
    { key: 'brand', placeholder: 'Brand' },
    { key: 'material', placeholder: 'Material' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.card}>
      {editing ? (
        <>
          {formFields.map(({ key, placeholder, keyboardType, transform }) => (
            <EditableField
              key={key}
              value={transform ? transform(editForm[key]) : editForm[key] || ''}
              onChangeText={(text) => updateEditForm(key, text)}
              placeholder={placeholder}
              keyboardType={keyboardType}
            />
          ))}
          <View style={styles.buttonRow}>
            <Button title="Save" onPress={saveChanges} />
            <Button title="Cancel" color="red" onPress={cancelEditing} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.meta}>Pattern Source: {project.pattern_source || 'N/A'}</Text>
          <Text style={styles.meta}>Status: {project.status}</Text>
          <Text style={styles.meta}>Type: {project.type || 'N/A'}</Text>
          <Text style={styles.meta}>Start Date: {project.start_date || 'N/A'}</Text>
          <Text style={styles.meta}>End Date: {project.end_date || 'N/A'}</Text>
          <Text style={styles.meta}>Hook Size: {project.hook_size || 'N/A'}</Text>
          <Text style={styles.meta}>Difficulty Level: {project.difficulty_level || 'N/A'}</Text>
          <Text style={styles.meta}>Colors: {renderColors(project.colors)}</Text>
          <Text style={styles.meta}>Rating: {project.rating ?? 'N/A'}</Text>
          <Text style={styles.meta}>Brand: {project.brand || 'N/A'}</Text>
          <Text style={styles.meta}>Material: {project.material || 'N/A'}</Text>

          <View style={styles.buttonRow}>
            <Button title="Edit" onPress={startEditing} />
            <Button title="Delete" color="red" onPress={deleteProject} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const EditableField = ({ value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    keyboardType={keyboardType}
  />
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
});

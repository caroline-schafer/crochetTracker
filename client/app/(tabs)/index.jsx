import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import api from '../../services/api';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleCrochetPress = () => {
    if (!selectedProject) {
      alert('Please select a project first!');
      return;
    }
    console.log('Crocheted today for project:', selectedProject);
    // Add your log creation logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Select a Project</Text>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          style={styles.projectList}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.projectItem,
                selectedProject?.id === item.id && styles.selectedProject,
              ]}
              onPress={() => setSelectedProject(item)}
            >
              <Text
                style={[
                  styles.projectText,
                  selectedProject?.id === item.id && styles.selectedText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Pressable style={styles.button} onPress={handleCrochetPress}>
        <Text style={styles.buttonText}>🧶 I crocheted today</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modal: {
    width: '100%',
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectList: {
    // no fixed height here, height controlled by modal container
  },
  projectItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 6,
  },
  selectedProject: {
    backgroundColor: '#6A5ACD',
  },
  projectText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

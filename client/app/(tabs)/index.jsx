import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import api from "../../services/api";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const [currentRes, longestRes] = await Promise.all([
          api.get("/streaks/current/"),
          api.get("/streaks/longest/"),
        ]);

        setCurrentStreak(currentRes.data);
        setLongestStreak(longestRes.data);
      } catch (error) {
        console.error("Error fetching streak data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects/");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
    fetchStreaks();
  }, []);

  const handleCrochetPress = async () => {
    if (!selectedProject) {
      alert("Please select a project first!");
      return;
    }

    try {
      console.log("Creating log for project:", selectedProject);

      // Example payload: adjust fields according to your Log model and serializer
      const payload = {
        project: selectedProject.id,
        date: new Date().toISOString().split("T")[0], // e.g. '2025-08-10'
        // add other fields if your serializer requires
      };

      // POST to /logs/ with auth handled by your api.js axios instance
      const response = await api.post("/logs/", payload);

      console.log("Log created:", response.data);

      // Optionally: refresh data or update UI as needed here
    } catch (error) {
      console.error("Error creating log:", error.response || error.message);
      alert("Failed to create log.");
    }
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
      <View>
        <Text>Current Streak</Text>
        {currentStreak && "length" in currentStreak ? (
          <Text>
            {currentStreak.length} days (from {currentStreak.start_date} to{" "}
            {currentStreak.end_date})
          </Text>
        ) : (
          <Text>{currentStreak?.message || "No current streak data."}</Text>
        )}

        <Text>Longest Streak</Text>
        {longestStreak && "length" in longestStreak ? (
          <Text>
            {longestStreak.length} days (from {longestStreak.start_date} to{" "}
            {longestStreak.end_date})
          </Text>
        ) : (
          <Text>{longestStreak?.message || "No longest streak data."}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modal: {
    width: "100%",
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  projectList: {
    // no fixed height here, height controlled by modal container
  },
  projectItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 6,
  },
  selectedProject: {
    backgroundColor: "#6A5ACD",
  },
  projectText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

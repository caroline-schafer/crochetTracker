import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function NewProject() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    pattern_source: '',
    status: 'planned',
    type: '',
    start_date: null, // store Date or null
    end_date: null,
    hook_size: '',
    difficulty_level: '',
    colors: '',
    rating: '',
    brand: '',
    material: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const STATUS_CHOICES = [
    { label: 'Planned', value: 'planned' },
    { label: 'WIPs', value: 'wips' },
    { label: 'Finished', value: 'finished' },
    { label: 'Frogged', value: 'frogged' },
    { label: 'Graveyard', value: 'graveyard' },
  ];

  const HOOK_SIZE_CHOICES = [
    { label: 'B-1 (2.25 mm)', value: 'B-1' },
    { label: 'C-2 (2.75 mm)', value: 'C-2' },
    { label: 'D-3 (3.25 mm)', value: 'D-3' },
    { label: 'E-4 (3.5 mm)', value: 'E-4' },
    { label: 'F-5 (3.75 mm)', value: 'F-5' },
    { label: 'G-6 (4.0 mm)', value: 'G-6' },
    { label: '7 (4.5 mm)', value: '7' },
    { label: 'H-8 (5.0 mm)', value: 'H-8' },
    { label: 'I-9 (5.5 mm)', value: 'I-9' },
    { label: 'J-10 (6.0 mm)', value: 'J-10' },
    { label: 'K-10.5 (6.5 mm)', value: 'K-10.5' },
    { label: 'L-11 (8.0 mm)', value: 'L-11' },
    { label: 'M-13 (9.0 mm)', value: 'M-13' },
    { label: 'N-15 (10.0 mm)', value: 'N-15' },
    { label: 'P-16 (11.5 mm)', value: 'P-16' },
    { label: 'Q (15.75 mm)', value: 'Q' },
    { label: 'S (19.0 mm)', value: 'S' },
  ];

  const DIFFICULTY_CHOICES = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Extra Hard', value: 'extra_hard' },
  ];

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) updateForm('start_date', selectedDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) updateForm('end_date', selectedDate);
  };

  const handleWebDateChange = (field, value) => {
    updateForm(field, value ? new Date(value) : null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        colors: form.colors
          ? form.colors.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
        rating: form.rating ? parseFloat(form.rating) : null,
        pattern_source: form.pattern_source || null,
        type: form.type || null,
        start_date: form.start_date ? formatDate(form.start_date) : null,
        end_date: form.end_date ? formatDate(form.end_date) : null,
        hook_size: form.hook_size || null,
        difficulty_level: form.difficulty_level || null,
        brand: form.brand || null,
        material: form.material || null,
      };

      const response = await api.post('/projects/', payload);
      Alert.alert('Success', 'Project created!');
      router.replace(`/project/${response.data.id}`);
    } catch (error) {
      console.error('Error creating project:', error?.response?.data || error);
      Alert.alert('Error', 'Could not create project.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => updateForm('title', text)}
        placeholder="Title (required)"
      />

      <TextInput
        style={styles.input}
        value={form.pattern_source}
        onChangeText={(text) => updateForm('pattern_source', text)}
        placeholder="Pattern Source"
      />

      <Text style={styles.label}>Status</Text>
      {Platform.OS === 'web' ? (
        <select
          value={form.status}
          onChange={(e) => updateForm('status', e.target.value)}
          style={styles.webSelect}
        >
          {STATUS_CHOICES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.status}
            onValueChange={(val) => updateForm('status', val)}
          >
            {STATUS_CHOICES.map(({ label, value }) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={form.type}
        onChangeText={(text) => updateForm('type', text)}
        placeholder="Type"
      />

      <Text style={styles.label}>Start Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={formatDate(form.start_date)}
          onChange={(e) => handleWebDateChange('start_date', e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{formatDate(form.start_date) || 'Select Start Date'}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={form.start_date || new Date()}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
              maximumDate={form.end_date || undefined}
            />
          )}
        </>
      )}

      <Text style={styles.label}>End Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={formatDate(form.end_date)}
          onChange={(e) => handleWebDateChange('end_date', e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{formatDate(form.end_date) || 'Select End Date'}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={form.end_date || new Date()}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={form.start_date || undefined}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Hook Size</Text>
      {Platform.OS === 'web' ? (
        <select
          value={form.hook_size}
          onChange={(e) => updateForm('hook_size', e.target.value)}
          style={styles.webSelect}
        >
          <option value="">Select Hook Size</option>
          {HOOK_SIZE_CHOICES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.hook_size}
            onValueChange={(val) => updateForm('hook_size', val)}
            prompt="Select Hook Size"
          >
            <Picker.Item label="Select Hook Size" value="" />
            {HOOK_SIZE_CHOICES.map(({ label, value }) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>
        </View>
      )}

      <Text style={styles.label}>Difficulty Level</Text>
      {Platform.OS === 'web' ? (
        <select
          value={form.difficulty_level}
          onChange={(e) => updateForm('difficulty_level', e.target.value)}
          style={styles.webSelect}
        >
          <option value="">Select Difficulty</option>
          {DIFFICULTY_CHOICES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.difficulty_level}
            onValueChange={(val) => updateForm('difficulty_level', val)}
            prompt="Select Difficulty"
          >
            <Picker.Item label="Select Difficulty" value="" />
            {DIFFICULTY_CHOICES.map(({ label, value }) => (
              <Picker.Item key={value} label={label} value={value} />
            ))}
          </Picker>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={form.colors}
        onChangeText={(text) => updateForm('colors', text)}
        placeholder="Colors (comma separated)"
      />

      <TextInput
        style={styles.input}
        value={form.rating}
        onChangeText={(text) => updateForm('rating', text)}
        placeholder="Rating (e.g. 4.5)"
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={form.brand}
        onChangeText={(text) => updateForm('brand', text)}
        placeholder="Brand"
      />

      <TextInput
        style={styles.input}
        value={form.material}
        onChangeText={(text) => updateForm('material', text)}
        placeholder="Material"
      />

      <View style={styles.buttonContainer}>
        <Button title="Create Project" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
  },
  label: { marginBottom: 4, fontWeight: '600' },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
  },
  webInput: {
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  webSelect: {
    marginBottom: 10,
    borderRadius: 6,
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 8,
  },
  buttonContainer: { marginTop: 16 },
});

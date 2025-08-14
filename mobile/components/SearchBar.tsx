import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ onSearch }: { onSearch: (text: string) => void }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Search events..."
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={onSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 15
  },
  input: {
    flex: 1,
    fontSize: 16
  }
});

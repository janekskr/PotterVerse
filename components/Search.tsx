"use client";

import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { View, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";

const filterPredicates = [
  "eq",
  "cont",
  "start",
  "end",
  "gt",
  "lt",
  "gteq",
  "lteq",
  "present",
  "blank",
  "null",
  "not_null",
];

const filterFields = [
  "name",
  "house",
  "patronus",
  "species",
  "blood_status",
  "role",
];

export default function Search({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [field, setField] = useState("");
  const [predicate, setPredicate] = useState("");
  const [value, setValue] = useState("");

  const handleSearch = () => {
    if (field && predicate) {
      onSearch(`filter[${field}_${predicate}]=${value}`);
      setModalVisible(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.filterButton}
      >
        <Ionicons name="filter" size={24} color="white" />
        <Text style={styles.filterButtonText}>Advanced Filter</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalTitle}>Advanced Filter</Text>

              <Text style={styles.label}>Field</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipContainer}
              >
                {filterFields.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.chip, field === f && styles.selectedChip]}
                    onPress={() => setField(f)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        field === f && styles.selectedChipText,
                      ]}
                    >
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Predicate</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipContainer}
              >
                {filterPredicates.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.chip,
                      predicate === p && styles.selectedChip,
                    ]}
                    onPress={() => setPredicate(p)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        predicate === p && styles.selectedChipText,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Value</Text>
              <TextInput
                style={styles.input}
                onChangeText={setValue}
                value={value}
                placeholder="Enter filter value"
              />

              <View style={styles.buttonContainer}>
                <Pressable onPress={handleSearch} style={styles.searchButton}>
                  <Text style={styles.buttonText}>Search</Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  filterButtonText: {
    color: "white",
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  chipContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: "#6200ee",
  },
  chipText: {
    color: "black",
  },
  selectedChipText: {
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');  // State to store the input task
  const [todos, setTodos] = useState([]); // State to store the list of tasks
  const [isInputVisible, setIsInputVisible] = useState(false);  // State to control visibility of input field
  const [editingTaskId, setEditingTaskId] = useState(null); // State to track which task is being edited
  const [buttonScale] = useState(new Animated.Value(1)); // State for button scale animation
  const [inputOpacity] = useState(new Animated.Value(0)); // State for input field opacity

  // Function to add a new task
  const handleAddTask = () => {
    if (task.trim()) {
      const newTodo = { id: Date.now().toString(), task, completed: false };
      setTodos([...todos, newTodo]);
      setTask(''); // Reset the input field
      setIsInputVisible(false); // Hide the input field after task is added
    }
  };

  // Function to toggle task completion
  const handleToggleTask = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to delete a task
  const handleDeleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to start editing a task
  const handleEditTask = (id) => {
    const taskToEdit = todos.find((todo) => todo.id === id);
    setTask(taskToEdit?.task || '');
    setEditingTaskId(id);
    setIsInputVisible(true); // Show input field when editing

    // Animate input field to fade in
    Animated.timing(inputOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to save edited task
  const handleSaveEdit = () => {
    if (task.trim()) {
      setTodos(todos.map((todo) =>
        todo.id === editingTaskId ? { ...todo, task } : todo
      ));
      setTask('');
      setIsInputVisible(false);
      setEditingTaskId(null); // Reset editing state

      // Animate input field to fade out after saving
      Animated.timing(inputOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Handle button animation when clicked
  const handleButtonPress = () => {
    Animated.sequence([
      // Scale down
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      // Scale back up
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsInputVisible(true); // Show input field when button is clicked

    // Animate input field to slide up or fade in
    Animated.timing(inputOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do App</Text>

      {/* Show the input field only if isInputVisible is true */}
      {isInputVisible && (
        <Animated.View style={[styles.inputContainer, { opacity: inputOpacity }]}>
          <TextInput
            style={styles.input}
            placeholder={editingTaskId ? 'Edit your task' : 'Add a new task'}
            value={task}
            onChangeText={setTask}
          />
        </Animated.View>
      )}

      {/* Task List */}
      <FlatList
        data={todos}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks available</Text>}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
              <Text style={[styles.todoText, item.completed && styles.completed]}>
                {item.task}
              </Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEditTask(item.id)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Floating Round Add Task Button with Animation */}
      <Animated.View style={[styles.addButton, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity onPress={handleButtonPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Save or Update Task Button */}
      {isInputVisible && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={editingTaskId ? handleSaveEdit : handleAddTask}
        >
          <Text style={styles.saveButtonText}>
            {editingTaskId ? 'Save Changes' : 'Add Task'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#008CBA',
    borderRadius: 50,
    elevation: 10, // Shadow effect for Android
    alignItems: 'center',
    justifyContent: 'center',
    width:60,
    height:60,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  todoText: {
    fontSize: 18,
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
  },
  editText: {
    color: '#007BFF',
    fontSize: 16,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTaskText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
});

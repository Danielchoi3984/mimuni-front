import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const LoginInspector = () => {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    // Verificar si el campo de legajo o contraseña está vacío
    if (!legajo.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu legajo y contraseña.');
      return;
    }

    const url = 'http://192.168.1.12:8080/inicio/loginInspector';

    const formData = new FormData();
    formData.append('legajo', legajo);
    formData.append('password', password);

    axios.post(url, formData)
      .then(response => {
        const data = response.data;
        if (data === 'Login exitoso') {
          Alert.alert('Ingreso exitoso', 'Has ingresado exitosamente.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ServiciosInspector', {legajo}),
            },
          ]);
        } else {
          Alert.alert('Error', data.message || 'Ocurrió un error inesperado.');
        }
      })
      .catch(error => {
        Alert.alert('Error', error.response.data);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar /> 
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MiMuni</Text>
        <View style={{ width: 20 }}></View>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Login Inspector Municipal</Text>
        <TextInput
          style={styles.input}
          placeholder="Legajo"
          placeholderTextColor="#8C7D85"
          value={legajo}
          onChangeText={setLegajo}
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8C7D85"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E9E4',
  },
  header: {
    backgroundColor: '#4A4E69',
    paddingTop: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#8C7D85',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4A4E69',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginInspector;

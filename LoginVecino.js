import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const LoginVecino = ({ navigation }) => {
  const [mail, setMail] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleLogin = () => {
    // Verificar si el campo de legajo o contraseña está vacío
    if (!mail.trim() || !contrasenia.trim()) {
      Alert.alert('Error', 'Por favor, ingrese tu mail y contraseña.');
      return;
    }

    const url = 'http://localhost:8080/inicio/loginVecino';

    const formData = new FormData();
    formData.append('mail', mail);
    formData.append('contrasenia', contrasenia);

    axios.post(url, formData)
      .then(response => {
        const data = response.data;
        if (data === 'Ingreso exitoso') {
          Alert.alert('Ingreso exitoso', 'Has ingresado exitosamente.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ServiciosVecino'),
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
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MiMuni</Text>
        <View style={{ width: 20 }}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Login Vecino del Municipio</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#8C7D85"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#8C7D85"
          value={contrasenia}
          onChangeText={setContrasenia}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('OlvideContrasenia')}>
          <Text style={styles.link}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registrarme')}>
          <Text style={styles.link}>Registrarme</Text>
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
  link: {
    color: '#4A4E69',
    fontSize: 14,
    marginVertical: 5,
  },
});

export default LoginVecino;
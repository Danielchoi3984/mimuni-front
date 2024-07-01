import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Registrarme = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [documento, setDocumento] = useState('');

  const handleRegistro = async () => {
    const formData = new FormData();
    formData.append('documento', documento);
    formData.append('mail', correo);

    const url = 'http://192.168.0.241:8080/inicio/register';
    axios.post(url, formData)
      .then(response => {
        const data = response.data; 
        if (data === 'Registro exitoso') {
          Alert.alert('Registro exitoso', 'Se le ha enviado un mail con cu contraseña provisoria.', [
            {
              text: 'OK',
            },
          ]);
        }else {
          Alert.alert('Error', data || 'Ocurrió un error inesperado.');
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
        <TextInput
          style={styles.input}
          placeholder="Documento"
          placeholderTextColor="#8C7D85"
          value={documento}
          onChangeText={setDocumento}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#8C7D85"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.infoText}>
          Este paso se realiza una única vez, la habilitación y generación de una clave puede tardar hasta 15 días hábiles.
          Requisitos: Ser vecino del municipio.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarme</Text>
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
  infoText: {
    fontSize: 14,
    color: '#8C7D85',
    marginBottom: 20,
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

export default Registrarme;
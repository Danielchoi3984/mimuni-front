import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Importar Axios

const OlvideContrasenia = ({ navigation }) => {
  const [correo, setCorreo] = useState('');

  const handleRecuperarContrasenia = async () => {
    const formData = new FormData();
    formData.append('mail', correo);

    const url = "http://192.168.1.12:8080/inicio/vecino/olvidecontrasenia";
    axios.post(url, formData)
      .then(response => {
        const data = response.data;
        if (data === "Correo enviado correctamente") {
          Alert.alert("Correo enviado", "La contraseña se ha enviado a su casilla de correo",[
            {
              text: 'OK',
            },
          ]);
        } else {
          Alert.alert('Error', response.data);
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
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#8C7D85"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleRecuperarContrasenia}>
          <Text style={styles.buttonText}>Recuperar Contraseña</Text>
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

export default OlvideContrasenia;
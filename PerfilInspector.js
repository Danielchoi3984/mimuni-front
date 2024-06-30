import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PerfilInspector = ({ route, navigation }) => {
  const [perfil, setPerfil] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { legajo } = route.params || {};

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(`http://192.168.0.241:8080/inicio/perfilInspector?legajo=${legajo}`);
        setPerfil(response.data);
      } catch (error) {
        console.error('Error fetching perfil:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del perfil');
      }
    };

    if (legajo) {
      fetchPerfil();
    }
  }, [legajo]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/inicio/cambiarPassword`, null, {
        params: {
          legajo,
          passwordActual: currentPassword,
          passwordNueva: newPassword,
          passwordNueva2: confirmNewPassword,
        },
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Cambio de contraseña exitoso');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      Alert.alert('Error', error.response.data);
    }
  };

  const handleLogout = () => {
    navigation.navigate('LoginInspector'); // Ajusta esto según el nombre de tu pantalla de inicio de sesión
  };

  if (!perfil) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar/>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mimuni</Text>
        <Ionicons name="mail" size={24} color="white" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Datos Personales</Text>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.text}>{perfil.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.text}>{perfil.documento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sector:</Text>
            <Text style={styles.text}>{perfil.sector}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Categoría:</Text>
            <Text style={styles.text}>{perfil.categoria}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Ingreso:</Text>
            <Text style={styles.text}>{perfil.fechaIngreso}</Text>
          </View>
        </View>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <View style={styles.passwordChange}>
          <Text style={styles.label}>Contraseña actual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="Ingrese su contraseña actual"
          />
          <Text style={styles.label}>Contraseña nueva</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Ingrese su nueva contraseña"
          />
          <Text style={styles.label}>Confirma nueva</Text>
          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            placeholder="Confirme su nueva contraseña"
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosInspector', { legajo })}>
          <Image source={require('./assets/servicios.png')} style={styles.icon} />
          <Text style={styles.navText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('./assets/reclamos.png')} style={styles.icon} />
          <Text style={styles.navText}>Reclamos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('./assets/denuncias.png')} style={styles.icon} />
          <Text style={styles.navText}>Denuncias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PerfilInspector', { legajo })}>
          <Image source={require('./assets/perfil.png')} style={styles.icon} />
          <Text style={styles.navText}>Perfil</Text>
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
  scrollContainer: {
    paddingBottom: 100, // Padding bottom to prevent content from being hidden behind navbar
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#9A8C98',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passwordChange: {
    backgroundColor: '#9A8C98',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4A4E69',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#4A4E69',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed from 'space-between' to 'space-around' to reduce space between buttons
    backgroundColor: '#4A4E69',
    paddingHorizontal: 10, // Reduced paddingHorizontal to make buttons closer
    paddingVertical: 20, // Increased padding vertical to make the navbar larger
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 25, // Increased icon size
    height: 25, // Increased icon size
    marginBottom: 5, // Reduced marginBottom to make buttons closer
  },
  navText: {
    color: 'white',
    fontSize: 14, // Increased font size for better visibility
  },
});

export default PerfilInspector;

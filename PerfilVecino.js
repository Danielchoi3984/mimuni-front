import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PerfilVecino = ({ route, navigation }) => {
  const [perfil, setPerfil] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { mail } = route.params || {};

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(`http://192.168.0.241:8080/inicio/perfilVecino?mail=${mail}`);
        setPerfil(response.data);
      } catch (error) {
        console.error('Error fetching perfil:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del perfil');
      }
    };

    if (mail) {
      fetchPerfil();
    }
  }, [mail]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/inicio/cambiarContraseniaVecino`, null, {
        params: {
          mail,
          actual: currentPassword,
          nueva1: newPassword,
          nueva2: confirmNewPassword,
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
    navigation.navigate('LoginVecino'); 
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MiMuni</Text>
        <View style={{ width: 20 }}></View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Datos Personales</Text>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.text}>{perfil.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Apellido:</Text>
            <Text style={styles.text}>{perfil.apellido}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.text}>{perfil.documento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.text}>{perfil.direccion}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Código de Barrio:</Text>
            <Text style={styles.text}>{perfil.codigobarrio}</Text>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosVecino', { mail })}>
          <Image source={require('./assets/servicios.png')} style={styles.icon} />
          <Text style={styles.navText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ReclamosVecino', { mail })}>
          <Image source={require('./assets/reclamos.png')} style={styles.icon} />
          <Text style={styles.navText}>Reclamos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DenunciasVecino', { mail })}>
          <Image source={require('./assets/denuncias.png')} style={styles.icon} />
          <Text style={styles.navText}>Denuncias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PerfilVecino', { mail })}>
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
    paddingBottom: 100, 
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
    justifyContent: 'space-around', 
    backgroundColor: '#4A4E69',
    paddingHorizontal: 10, 
    paddingVertical: 20, 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 25, 
    height: 25, 
    marginBottom: 5,
  },
  navText: {
    color: 'white',
    fontSize: 14, 
  },
});

export default PerfilVecino;

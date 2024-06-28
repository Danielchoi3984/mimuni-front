import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PerfilVecino = ({ route, navigation }) => {
  const [perfil, setPerfil] = useState(null); // Inicializamos perfil como null para indicar que aún no se han cargado los datos
  const { mail } = route.params || {};

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/inicio/perfilVecino?mail=${mail}`);
        setPerfil(response.data); // Actualizamos el estado con los datos recibidos del servidor
      } catch (error) {
        console.error('Error fetching perfil:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del perfil');
      }
    };

    if (mail) {
      fetchPerfil(); // Llamamos a la función para cargar el perfil cuando mail esté disponible
    }
  }, [mail]); // Dependencia de efecto: se ejecutará cada vez que mail cambie

  // Si perfil es null, mostrar un mensaje de carga o un indicador de carga
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
        <Text style={styles.headerTitle}>Mimuni</Text>
        <View style={{ width: 20 }}></View>
      </View>
      <Text style={styles.title}>Perfil de Vecino</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Documento:</Text>
        <Text style={styles.text}>{perfil.documento}</Text>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.text}>{perfil.nombre}</Text>
        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.text}>{perfil.apellido}</Text>
        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.text}>{perfil.direccion}</Text>
        <Text style={styles.label}>Código de Barrio:</Text>
        <Text style={styles.text}>{perfil.codigobarrio}</Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('ServiciosVecino', { mail })}
        >
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
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('PerfilVecino', { mail })}
        >
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
    paddingTop: 0,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4A4E69',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 10,
  },
  navText: {
    color: 'white',
    fontSize: 12,
  },
});

export default PerfilVecino;

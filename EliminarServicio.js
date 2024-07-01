import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const EliminarServicio = ({ route, navigation }) => {
  const [mail] = useState(route.params.mail);
  const [serviciosProfesionales, setServiciosProfesionales] = useState([]);
  const [serviciosComercio, setServiciosComercio] = useState([]);
  const [mostrarProfesionales, setMostrarProfesionales] = useState(true); // Estado para mostrar servicios profesionales
  const [mostrarComercio, setMostrarComercio] = useState(false); // Estado para mostrar servicios de comercio

  // Obtener los servicios profesionales
  const fetchServiciosProfesionales = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/inicio/misServiciosProfesionales?mail=${mail}`);
      setServiciosProfesionales(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios profesionales:', error);
    }
  };

  // Obtener los servicios de comercio
  const fetchServiciosComercio = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/inicio/misServiciosComercio?mail=${mail}`);
      setServiciosComercio(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios de comercio:', error);
    }
  };

  useEffect(() => {
    fetchServiciosProfesionales();
    fetchServiciosComercio();
  }, []);

  // Función para eliminar servicio profesional por ID
  const eliminarServicioProfesional = async (idServicio) => {
    try {
      await axios.delete(`http://localhost:8080/inicio/eliminarServicioProfesional?mail=${mail}&idServicio=${idServicio}`);
      // Actualizar la lista de servicios profesionales después de eliminar
      fetchServiciosProfesionales();
      Alert.alert('Eliminación exitosa', 'El servicio profesional ha sido eliminado.');
    } catch (error) {
      console.error('Error al eliminar el servicio profesional:', error);
      Alert.alert('Error', 'No se pudo eliminar el servicio profesional.');
    }
  };

  // Función para eliminar servicio de comercio por ID
  const eliminarServicioComercio = async (idServicio) => {
    try {
      await axios.delete(`http://localhost:8080/inicio/eliminarServicioComercio?mail=${mail}&idServicio=${idServicio}`);
      // Actualizar la lista de servicios de comercio después de eliminar
      fetchServiciosComercio();
      Alert.alert('Eliminación exitosa', 'El servicio de comercio ha sido eliminado.');
    } catch (error) {
      console.error('Error al eliminar el servicio de comercio:', error);
      Alert.alert('Error', 'No se pudo eliminar el servicio de comercio.');
    }
  };

  // Función para cambiar entre la sección de servicios profesionales y servicios de comercio
  const mostrarServiciosProfesionales = () => {
    setMostrarProfesionales(true);
    setMostrarComercio(false);
  };

  const mostrarServiciosComercio = () => {
    setMostrarProfesionales(false);
    setMostrarComercio(true);
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

      <Text style={styles.title}>Eliminar Servicio</Text>

      {/* Botones para cambiar entre las secciones */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity style={[styles.toggleButton, mostrarProfesionales && styles.activeButton]} onPress={mostrarServiciosProfesionales}>
          <Text style={mostrarProfesionales ? styles.activeButtonText : styles.buttonText}>Servicios Profesionales</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, mostrarComercio && styles.activeButton]} onPress={mostrarServiciosComercio}>
          <Text style={mostrarComercio ? styles.activeButtonText : styles.buttonText}>Servicios de Comercio</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar servicios */}
      <ScrollView style={styles.scrollView}>
        {mostrarProfesionales && serviciosProfesionales.map(servicio => (
          <View key={servicio.idservicioprofesional} style={styles.servicioContainer}>
            <Text>ID: {servicio.idservicioprofesional}</Text>
            <Text>Nombre: {servicio.nombre} {servicio.apellido}</Text>
            <Text>Contacto: {servicio.contacto}</Text>
            <Text>Horario: {servicio.horario}</Text>
            <Text>Rubro: {servicio.rubro}</Text>
            <Text>Descripción: {servicio.descripcion}</Text>
            <Text>Estado: {servicio.estado}</Text>
            <TouchableOpacity style={styles.eliminarButton} onPress={() => eliminarServicioProfesional(servicio.idservicioprofesional)}>
              <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        {mostrarComercio && serviciosComercio.map(servicio => (
          <View key={servicio.idServicioComercio} style={styles.servicioContainer}>
            <Text>ID: {servicio.idServicioComercio}</Text>
            <Text>Dirección: {servicio.direccion}</Text>
            <Text>Contacto: {servicio.contacto}</Text>
            <Text>Descripción: {servicio.descripcion}</Text>
            <Text>Estado: {servicio.estado}</Text>
            <TouchableOpacity style={styles.eliminarButton} onPress={() => eliminarServicioComercio(servicio.idServicioComercio)}>
              <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosVecino', { mail })}>
          <Image source={require('./assets/servicios.png')} style={styles.icon} />
          <Text style={styles.navText}>Servicios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ReclamosVecino', { mail })}>
          <Image source={require('./assets/reclamos.png')} style={styles.icon} />
          <Text style={styles.navText}>Reclamos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
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
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#4A4E69',
    paddingTop: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 130,
  },
  backIcon: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginBottom: 80, // Adjusted marginBottom to accommodate navbar
  },
  servicioContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
  },
  eliminarButton: {
    position: 'absolute',
    top: 5,
    right: 5,
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

export default EliminarServicio;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const EliminarServicio = ({ route, navigation }) => {
  const [idServicioComercio, setIdServicioComercio] = useState('');
  const [idServicioProfesional, setIdServicioProfesional] = useState('');
  const [serviciosComercio, setServiciosComercio] = useState([]);
  const [serviciosProfesionales, setServiciosProfesionales] = useState([]);
  const [mostrarFormularioComercio, setMostrarFormularioComercio] = useState(true); // Mostrar el formulario de comercio por defecto
  const [mostrarFormularioProfesional, setMostrarFormularioProfesional] = useState(false);

  const { mail } = route.params || {};

  // Obtener los IDs de los servicios disponibles al cargar el componente
  useEffect(() => {
    fetchServiciosComercio();
    fetchServiciosProfesionales();
  }, []);

  // Función para obtener los IDs de los servicios de comercio
  const fetchServiciosComercio = async () => {
    try {
      const response = await axios.get(`http://192.168.0.241:8080/inicio/misServiciosComercio?mail=${encodeURIComponent(mail)}`);
      setServiciosComercio(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios de comercio:', error);
      // Manejar errores aquí
    }
  };

  // Función para obtener los IDs de los servicios profesionales
  const fetchServiciosProfesionales = async () => {
    try {
      const response = await axios.get(`http://192.168.0.241:8080/inicio/misServiciosProfesionales?mail=${encodeURIComponent(mail)}`);
      setServiciosProfesionales(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios profesionales:', error);
      // Manejar errores aquí
    }
  };

  // Función para eliminar un servicio de comercio por su ID
  const eliminarServicioComercio = async () => {
    try {
      const url = `http://192.168.0.241:8080/inicio/eliminarServicioComercio?mail=${encodeURIComponent(mail)}&idServicio=${idServicioComercio}`;
      const response = await axios.delete(url);
      console.log('Respuesta de eliminación de servicio de comercio:', response.data);
      // Manejar la respuesta del servidor según sea necesario
    } catch (error) {
      console.error('Error al eliminar el servicio de comercio:', error);
      // Manejar errores aquí
    }
  };

  // Función para eliminar un servicio profesional por su ID
  const eliminarServicioProfesional = async () => {
    try {
      const url = `http://192.168.0.241:8080/inicio/eliminarServicioProfesional?mail=${encodeURIComponent(mail)}&idServicio=${idServicioProfesional}`;
      const response = await axios.delete(url);
      console.log('Respuesta de eliminación de servicio profesional:', response.data);
      // Manejar la respuesta del servidor según sea necesario
    } catch (error) {
      console.error('Error al eliminar el servicio profesional:', error);
      // Manejar errores aquí
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado y botones de navegación */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mimuni</Text>
        <View style={{ width: 20 }}></View>
      </View>

      {/* Título de Eliminar Servicio */}
      <Text style={styles.title}>Eliminar Servicio</Text>

      {/* Botones para seleccionar tipo de formulario */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity style={[styles.toggleButton, mostrarFormularioComercio && styles.activeButton]} onPress={() => {setMostrarFormularioComercio(true); setMostrarFormularioProfesional(false);}}>
          <Text style={mostrarFormularioComercio ? styles.activeButtonText : styles.buttonText}>Servicio Comercio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, mostrarFormularioProfesional && styles.activeButton]} onPress={() => {setMostrarFormularioProfesional(true); setMostrarFormularioComercio(false);}}>
          <Text style={mostrarFormularioProfesional ? styles.activeButtonText : styles.buttonText}>Servicio Profesional</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario de servicio seleccionado */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mostrarFormularioComercio && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Servicios de Comercio Disponibles:</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.serviceList}>
              {serviciosComercio.map(servicio => (
                <TouchableOpacity
                  key={servicio.id}
                  style={styles.serviceItem}
                  onPress={() => setIdServicioComercio(servicio.id)}
                >
                  <Text>{servicio.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el ID del servicio de comercio a eliminar"
              value={idServicioComercio}
              onChangeText={setIdServicioComercio}
            />
            <Button title="Eliminar Servicio de Comercio" onPress={eliminarServicioComercio} />
          </View>
        )}

        {mostrarFormularioProfesional && (
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Servicios Profesionales Disponibles:</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.serviceList}>
              {serviciosProfesionales.map(servicio => (
                <TouchableOpacity
                  key={servicio.id}
                  style={styles.serviceItem}
                  onPress={() => setIdServicioProfesional(servicio.id)}
                >
                  <Text>{servicio.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Ingrese el ID del servicio profesional a eliminar"
              value={idServicioProfesional}
              onChangeText={setIdServicioProfesional}
            />
            <Button title="Eliminar Servicio Profesional" onPress={eliminarServicioProfesional} />
          </View>
        )}
      </ScrollView>

      {/* Navegación inferior */}
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
    textAlign: 'center',
    marginVertical: 10,
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A4E69',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#6D6D6D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 200,
    marginBottom: 20,
  },
  serviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  serviceItem: {
    backgroundColor: '#DDD',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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

export default EliminarServicio;

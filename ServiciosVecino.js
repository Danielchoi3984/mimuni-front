import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const ServiciosVecino = ({ navigation }) => {
  const [serviciosComercios, setServiciosComercios] = useState([]);
  const [serviciosProfesionales, setServiciosProfesionales] = useState([]);

  useEffect(() => {
    const fetchServiciosComercios = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inicio/servicios/comercios');
        setServiciosComercios(response.data);
      } catch (error) {
        console.error('Error fetching comercios:', error);
      }
    };

    const fetchServiciosProfesionales = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inicio/servicios/profesionales');
        setServiciosProfesionales(response.data);
      } catch (error) {
        console.error('Error fetching profesionales:', error);
      }
    };

    fetchServiciosComercios();
    fetchServiciosProfesionales();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderCard = (servicio, index) => (
    <View key={index} style={styles.card}>
      <Image source={require('./assets/luzRota.jpeg')} style={styles.cardImage} />
      {servicio.nombre !== undefined && (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}><Text style={styles.boldText}>Responsable:</Text> {servicio.apellido + " " + servicio.nombre}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Horario:</Text> {servicio.horario}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Rubro:</Text> {servicio.rubro}</Text>
        </View>
      )}
      {servicio.direccion !== undefined &&(
        <View style={{ flexDirection: "column" }}>
            <Text style={styles.cardText}><Text style={styles.boldText}>Dirección:</Text> {servicio.direccion}</Text>
        </View>
      )}
      <Text style={styles.cardText}><Text style={styles.boldText}>Contacto:</Text> {servicio.contacto}</Text>
      <Text style={styles.cardText}><Text style={styles.boldText}>Descripción:</Text> {servicio.descripcion}</Text>
    </View>
  );

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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('GenerarServicio')}
          >
            <Ionicons name="add" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Generar Servicio</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('EliminarServicio')}
          >
            <Ionicons name="close" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Eliminar Servicio</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Comercios</Text>
        {serviciosComercios.map((servicio, index) => renderCard(servicio, index))}
        <Text style={styles.subtitle}>Profesionales</Text>
        {serviciosProfesionales.map((servicio, index) => renderCard(servicio, index))}
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton}>
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
          onPress={() => navigation.navigate('PerfilVecino')} // Navegar a PerfilVecino
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
    paddingTop: 0, // Elimina el espacio en blanco en la parte superior
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
  scrollView: {
    paddingHorizontal: 15,
    paddingBottom: 60, // Ajuste para evitar que el contenido se solape con el navbar
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#8C7D85',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardText: {
    color: '#FFF',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#8C7D85',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4A4E69',
    paddingHorizontal: 15,
    paddingVertical: 10,
    position: 'absolute', // Fija el navbar en la parte inferior
    bottom: 0, // Alinea el navbar en la parte inferior
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
  cardImage: { // Estilo para la imagen dentro de la tarjeta
    width: '100%', // Ancho igual al 100% del contenedor (tarjeta)
    height: 200, // Altura fija para controlar el tamaño de la imagen
    borderRadius: 10, // Bordes redondeados para que coincidan con la tarjeta
  },
});

export default ServiciosVecino;
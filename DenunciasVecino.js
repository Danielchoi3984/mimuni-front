import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const DenunciasVecino = ({ route, navigation }) => {
  const [denunciasRecibidas, setDenunciasRecibidas] = useState([]);
  const [denunciasRealizadas, setDenunciasRealizadas] = useState([]);
  const [misDenuncias, setMisDenuncias] = useState([]);
  const [showRecibidas, setShowRecibidas] = useState(true);

  const { mail } = route.params || {};

  useEffect(() => {
    const fetchDenunciasRecibidas = async () => {
      try {
        const response = await axios.get(`http://192.168.0.241:8080/inicio/denunciasRecibidas?mail=${mail}`);
        setDenunciasRecibidas(response.data);
      } catch (error) {
        console.error('Error fetching denuncias recibidas:', error);
      }
    };

    const fetchDenunciasRealizadas = async () => {
      try {
        const response = await axios.get(`http://192.168.0.241:8080/inicio/denunciasRealizadas?mail=${mail}`);
        setDenunciasRealizadas(response.data);
      } catch (error) {
        console.error('Error fetching denuncias realizadas:', error);
      }
    };

    const fetchMisDenuncias = async () => {
      try {
        const response = await axios.get(`http://192.168.0.241:8080/inicio/denuncias/misDenuncias?mail=${mail}`);
        setMisDenuncias(response.data);
      } catch (error) {
        {/*console.error('Error fetching mis denuncias:', error);*/}
      }
    };

    fetchDenunciasRecibidas();
    fetchDenunciasRealizadas();
    fetchMisDenuncias();
  }, [mail]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderCard = (denuncia, index) => (
    <View key={index} style={styles.card}>
      <Image source={require('./assets/luzRota.jpeg')} style={styles.cardImage} />
      {denuncia.titulo !== undefined && (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}><Text style={styles.boldText}>Título:</Text> {denuncia.titulo}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Fecha:</Text> {denuncia.fecha}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Estado:</Text> {denuncia.estado}</Text>
        </View>
      )}
      {denuncia.descripcion !== undefined && (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}><Text style={styles.boldText}>Descripción:</Text> {denuncia.descripcion}</Text>
        </View>
      )}
      <Text style={styles.cardText}><Text style={styles.boldText}>Ubicación:</Text> {denuncia.ubicacion}</Text>
    </View>
  );

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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('GenerarDenuncia', { mail })}
          >
            <Ionicons name="add" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Generar Denuncia</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, showRecibidas ? styles.activeButton : null]}
            onPress={() => setShowRecibidas(true)}
          >
            <Text style={styles.switchButtonText}>Recibidas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, !showRecibidas ? styles.activeButton : null]}
            onPress={() => setShowRecibidas(false)}
          >
            <Text style={styles.switchButtonText}>Realizadas</Text>
          </TouchableOpacity>
        </View>
        {showRecibidas ? (
          <>
            <Text style={styles.subtitle}>Denuncias Recibidas</Text>
            {denunciasRecibidas.map((denuncia, index) => renderCard(denuncia, index))}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Mis Denuncias</Text>
            {misDenuncias.map((denuncia, index) => renderCard(denuncia, index))}
          </>
        )}
        {!showRecibidas && (
          <>
            <Text style={styles.subtitle}>Denuncias Realizadas</Text>
            {denunciasRealizadas.map((denuncia, index) => renderCard(denuncia, index))}
          </>
        )}
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

        <TouchableOpacity style={styles.navButton}>
          <Image source={require('./assets/denuncias.png')} style={styles.icon} />
          <Text style={styles.navText}>Denuncias</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton} onPress={() => navigation.navigate('PerfilVecino', { mail })} >
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
  scrollView: {
    paddingHorizontal: 15,
    paddingBottom: 60,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8C7D85',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#4A4E69',
  },
  switchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default DenunciasVecino;

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Modal, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const DenunciasVecino = ({ route, navigation }) => {
  const [denunciasRecibidas, setDenunciasRecibidas] = useState([]);
  const [denunciasRealizadas, setDenunciasRealizadas] = useState([]);
  const [showRecibidas, setShowRecibidas] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [movimientosDenuncia, setMovimientosDenuncia] = useState([]);

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

    fetchDenunciasRecibidas();
    fetchDenunciasRealizadas();
  }, [mail]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const fetchMovimientosDenuncia = (idDenuncia) => {
    axios.get(`http://192.168.0.241:8080/inicio/movimientosDenuncia?idDenuncia=${idDenuncia}`)
      .then(response => {
        setMovimientosDenuncia(response.data);
        setModalVisible(true);
      })
      .catch(error => {
        console.error('Error fetching movimientos de denuncia:', error);
      });
  };

  const renderCard = (denuncia, index) => (
    <View key={index} style={styles.card}>
      <Image source={require('./assets/luzRota.jpeg')} style={styles.cardImage} />
      {denuncia.titulo && (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}><Text style={styles.boldText}>Título:</Text> {denuncia.titulo}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Fecha:</Text> {denuncia.fecha}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Estado:</Text> {denuncia.estado}</Text>
        </View>
      )}
      {denuncia.descripcion && (
        <View style={{ flexDirection: "column" }}>
           <Text style={styles.cardText}><Text style={styles.boldText}>ID:</Text> {denuncia.idDenuncias}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Descripción:</Text> {denuncia.descripcion}</Text>
        </View>
      )}
      <Text style={styles.cardText}><Text style={styles.boldText}>Ubicación:</Text> {denuncia.sitio.calle}</Text>
      <TouchableOpacity style={styles.movimientosButton} onPress={() => fetchMovimientosDenuncia(denuncia.idDenuncias)}>
        <Text style={styles.movimientosButtonText}>Movimientos</Text>
      </TouchableOpacity>
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
            <Text style={styles.subtitle}>Denuncias Realizadas</Text>
            {denunciasRealizadas.map((denuncia, index) => renderCard(denuncia, index))}
          </>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Movimientos de la Denuncia:</Text>
            {movimientosDenuncia.map((movimiento, index) => (
              <View key={index} style={styles.movimientoContainer}>
                <Text style={styles.modalText}><Text style={styles.boldText}>Causa:</Text> {movimiento.causa}</Text>
                <Text style={styles.modalText}><Text style={styles.boldText}>Fecha:</Text> {new Date(movimiento.fecha).toLocaleString()}</Text>
                <Text style={styles.modalText}><Text style={styles.boldText}>Responsable:</Text> {movimiento.responsable}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22223B',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A4E69',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeButton: {
    borderBottomColor: '#4A4E69',
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4E69',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#22223B',
  },
  boldText: {
    fontWeight: 'bold',
  },
  movimientosButton: {
    backgroundColor: '#4A4E69',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  movimientosButtonText: {
    color: 'white',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#22223B',
  },
  movimientoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 10,
    marginBottom: 10,
  },
});

export default DenunciasVecino;

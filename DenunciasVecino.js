import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const DenunciasVecino = ({ route, navigation }) => {
  const [denunciasRecibidas, setDenunciasRecibidas] = useState([]);
  const [denunciasRealizadas, setDenunciasRealizadas] = useState([]);
  const [showRecibidas, setShowRecibidas] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [movimientosDenuncia, setMovimientosDenuncia] = useState([]);
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState(null);
  const [imagenesDenuncia, setImagenesDenuncia] = useState([]);

  const { mail } = route.params || {};

  const fetchDenunciasRecibidas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/inicio/denunciasRecibidas?mail=${mail}`);
      const denuncias = response.data;

      // Fetch images for each denuncia
      const denunciasConImagenes = await Promise.all(denuncias.map(async (denuncia) => {
        const imagenesResponse = await axios.get(`http://localhost:8080/inicio/imagenesDenuncia?idDenuncia=${denuncia.idDenuncias}`);
        const imagenes = imagenesResponse.data;
        return { ...denuncia, imagenes }; // Store all images in the denuncia object
      }));

      setDenunciasRecibidas(denunciasConImagenes);
    } catch (error) {
      console.error('Error fetching denuncias recibidas:', error);
    }
  };

  const fetchDenunciasRealizadas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/inicio/denunciasRealizadas?mail=${mail}`);
      const denuncias = response.data;

      // Fetch images for each denuncia
      const denunciasConImagenes = await Promise.all(denuncias.map(async (denuncia) => {
        const imagenesResponse = await axios.get(`http://localhost:8080/inicio/imagenesDenuncia?idDenuncia=${denuncia.idDenuncias}`);
        const imagenes = imagenesResponse.data;
        return { ...denuncia, imagenes }; // Store all images in the denuncia object
      }));

      setDenunciasRealizadas(denunciasConImagenes);
    } catch (error) {
      console.error('Error fetching denuncias realizadas:', error);
    }
  };

  useEffect(() => {
    fetchDenunciasRecibidas();
    fetchDenunciasRealizadas();
  }, [mail]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDenunciasRecibidas();
      fetchDenunciasRealizadas();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchMovimientosDenuncia = (idDenuncia) => {
    axios.get(`http://localhost:8080/inicio/movimientosDenuncia?idDenuncia=${idDenuncia}`)
      .then(response => {
        setMovimientosDenuncia(response.data);
        setDenunciaSeleccionada(idDenuncia);
        setModalVisible(true);
      })
      .catch(error => {
        console.error('Error fetching movimientos de denuncia:', error);
      });
  };

  const renderCard = (denuncia, index) => (
    <View key={index} style={styles.card}>
      {denuncia.titulo && (
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.cardText}><Text style={styles.boldText}>Título:</Text> {denuncia.titulo}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Fecha:</Text> {denuncia.fecha}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>Estado:</Text> {denuncia.estado}</Text>
        </View>
      )}
      {denuncia.descripcion && (
        <View style={{ flexDirection: "column" }}>
          
          <ScrollView horizontal>
            {denuncia.imagenes.map((imagen, index) => (
              <Image key={index} source={{ uri: imagen }} style={styles.cardImage} />
            ))}
          </ScrollView>
          <Text style={styles.cardText}><Text style={styles.boldText}>ID:</Text> {denuncia.idDenuncias}</Text>
          <Text style={styles.cardText}><Text style={styles.boldText}>DNI Denunciado:</Text> {denuncia.documento}</Text>
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
              onPress={() => {
                setModalVisible(false);
                setDenunciaSeleccionada(null);
                setImagenesDenuncia([]);
              }}
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
    paddingBottom: 80,
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
  cardText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#22223B',
  },
  boldText: {
    fontWeight: 'bold',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
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
  modalImage: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },
});
export default DenunciasVecino;
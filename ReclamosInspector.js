import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Switch, Modal, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ReclamosInspector = ({ route, navigation }) => {
  const [showMyReclamos, setShowMyReclamos] = useState(false);
  const [reclamos, setReclamos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [movimientosReclamo, setMovimientosReclamo] = useState([]);
  const [imagenesReclamo, setImagenesReclamo] = useState({});
  const { legajo } = route.params || {};

  useEffect(() => {
    fetchReclamos();
  }, [showMyReclamos, legajo]);

  const fetchReclamos = () => {
    let endpoint = showMyReclamos
      ? `http://localhost:8080/inicio/misReclamosInspector?legajo=${legajo}`
      : `http://localhost:8080/inicio/reclamosPorSector?legajo=${legajo}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReclamos(data);
          data.forEach(reclamo => {
            fetchImagenesReclamo(reclamo.idReclamo);
          });
        } else {
          console.error('Error fetching reclamos: Response is not an array', data);
        }
      })
      .catch(error => console.error('Error fetching reclamos:', error));
  };

  const fetchMovimientosReclamo = (idReclamo) => {
    fetch(`http://localhost:8080/inicio/movimientosReclamo?idReclamo=${idReclamo}`)
      .then(response => response.json())
      .then(data => {
        setMovimientosReclamo(data);
        setModalVisible(true);
      })
      .catch(error => console.error('Error fetching movimientos de reclamo:', error));
  };

  const fetchImagenesReclamo = (idReclamo) => {
    fetch(`http://localhost:8080/inicio/imagenesReclamo?idReclamo=${idReclamo}`)
      .then(response => response.json())
      .then(data => {
        setImagenesReclamo(prevState => ({
          ...prevState,
          [idReclamo]: data,
        }));
      })
      .catch(error => console.error('Error fetching imagenes de reclamo:', error));
  };

  const handleAddImage = async (idReclamo) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        const formData = new FormData();
        formData.append('legajo', legajo);
        formData.append('idReclamo', idReclamo);
        formData.append('files', {
          uri: result.uri,
          type: 'image/jpeg',
          name: 'imageName.jpg',
        });
  
        const response = await fetch('http://192.168.0.241:8080/inicio/agregarImagenAreclamoInspector', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Verificar el estado de la respuesta
        if (!response.ok) {
          throw new Error(`Error uploading image: ${response.status} - ${response.statusText}`);
        }
  
        // Manejar la respuesta (puede no ser JSON)
        const responseData = await response.text(); // Obtener el texto de la respuesta
        console.log('Image added successfully:', responseData);
        Alert.alert("Exito", responseData);
  
        // Actualizar el estado de imágenes
        setImagenesReclamo({}); // Limpiar el estado de imágenes para forzar la recarga
        fetchReclamos(); // Actualizar la lista de reclamos después de agregar la imagen
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
      // Aquí podrías mostrar una alerta o un mensaje de error según sea necesario
    }
  };
  

  const showAlert = () => {
    Alert.alert(
      'Acceso Restringido',
      'Como inspector no puede realizar denuncias.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Reclamos</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('GenerarReclamoInspector', { legajo })}>
          <Text style={styles.buttonText}>Generar Reclamo</Text>
        </TouchableOpacity>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Reclamos Del Sector</Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            value={showMyReclamos}
            onValueChange={setShowMyReclamos}
          />
          <Text style={styles.switchText}>Ver mis reclamos</Text>
        </View>
        {reclamos.length > 0 ? (
          reclamos.map((reclamo) => (
            <View key={reclamo.idReclamo} style={styles.reclamoCard}>
              <FlatList
                horizontal
                data={imagenesReclamo[reclamo.idReclamo] || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width: 100, height: 100, marginBottom: 10 }}
                  />
                )}
                ListEmptyComponent={() => (
                  <Image
                    source={require("./assets/luzRota.jpeg")} // Imagen por defecto cuando no hay imágenes
                    style={styles.cardImage}
                  />
                )}
              />
              <Text style={styles.reclamoText}>ID: {reclamo.idReclamo}</Text>
              <Text style={styles.reclamoText}>Documento: {reclamo.documento}</Text>
              <Text style={styles.reclamoText}>Dirección: {reclamo.idSitio}</Text>
              <Text style={styles.reclamoText}>Tipo Desperfecto: {reclamo.idDesperfecto}</Text>
              <Text style={styles.reclamoText}>Estado: {reclamo.estado}</Text>
              <Text style={styles.reclamoText}>ID Reclamo Unificado: {reclamo.idReclamoUnificado}</Text>
              <Text style={styles.reclamoText}>Descripción: {reclamo.descripcion}</Text>
              {showMyReclamos && (
                <TouchableOpacity style={styles.imageButton} onPress={() => handleAddImage(reclamo.idReclamo)}>
                  <Text style={styles.imageButtonText}>Agregar Imagen</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.movimientosButton} onPress={() => fetchMovimientosReclamo(reclamo.idReclamo)}>
                <Text style={styles.movimientosButtonText}>Movimientos</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No hay reclamos para mostrar.</Text>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Movimientos del Reclamo:</Text>
            {movimientosReclamo.map((movimiento, index) => (
              <View key={index} style={styles.movimientoContainer}>
                <Text style={styles.modalText}><Text style={styles.boldText}>Causa:</Text> {movimiento.causa}</Text>
                <Text style={styles.modalText}><Text style={styles.boldText}>Fecha:</Text> {new Date(movimiento.fecha).toLocaleString()}</Text>
                <Text style={styles.modalText}><Text style={styles.boldText}>Responsable:</Text> {movimiento.responsable}</Text>
              </View>
            ))}
            <Text style={styles.modalText}>Imágenes del Reclamo:</Text>

            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PerfilInspector')}>
          <Ionicons name="person-circle-outline" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => showAlert()}>
          <Ionicons name="document-outline" size={24} color="white" />
          <Text style={styles.navText}>Generar Denuncia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosInspector')}>
          <Ionicons name="list-outline" size={24} color="white" />
          <Text style={styles.navText}>Servicios</Text>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitleContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 16,
  },
  reclamoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  reclamoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  movimientosButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  movimientosButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  movimientoContainer: {
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

export default ReclamosInspector;

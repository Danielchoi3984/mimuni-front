import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Switch, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ReclamosVecino = ({ route, navigation }) => {
  const [showMyReclamos, setShowMyReclamos] = useState(false);
  const [reclamos, setReclamos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [movimientosReclamo, setMovimientosReclamo] = useState([]);
  const [imagenesReclamo, setImagenesReclamo] = useState({});
  const { mail } = route.params || {};

  useEffect(() => {
    fetchReclamos();
  }, [showMyReclamos, mail]);

  const fetchReclamos = () => {
    const endpoint = showMyReclamos
      ? `http://192.168.0.241:8080/inicio/misReclamosVecino?mail=${mail}`
      : 'http://192.168.0.241:8080/inicio/todosReclamos';

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReclamos(data);
          data.forEach(reclamo => {
            fetchImagenesReclamo(reclamo.idReclamo); // Llamar a la función para obtener imágenes
          });
        } else {
          setReclamos([]);
        }
      })
      .catch(error => {
        console.error('Error fetching reclamos:', error);
        setReclamos([]);
      });
  };

  const fetchMovimientosReclamo = (idReclamo) => {
    fetch(`http://192.168.0.241:8080/inicio/movimientosReclamo?idReclamo=${idReclamo}`)
      .then(response => response.json())
      .then(data => {
        setMovimientosReclamo(data);
        setModalVisible(true);
      })
      .catch(error => console.error('Error fetching movimientos de reclamo:', error));
  };

  const fetchImagenesReclamo = (idReclamo) => {
    fetch(`http://192.168.0.241:8080/inicio/imagenesReclamo?idReclamo=${idReclamo}`)
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
        formData.append('mail', mail);
        formData.append('idReclamo', idReclamo);
        formData.append('imagen', {
          uri: result.uri,
          type: 'image/jpeg',
          name: 'imageName.jpg',
        });
  
        fetch('http://192.168.0.241:8080/inicio/agregarImagenAreclamoVecino', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log('Image added successfully:', data);
            setImagenesReclamo({}); // Limpiar el estado de imágenes para forzar la recarga
            fetchReclamos(); // Actualizar la lista de reclamos después de agregar la imagen
          })
          .catch(error => console.error('Error uploading image:', error));
      }
    } catch (error) {
      console.error('Error accessing image library:', error);
    }
  };
  

  const clearCacheAndFetchReclamos = () => {
    setImagenesReclamo({}); // Limpiar el estado de imágenes para forzar la recarga
    fetchReclamos(); // Actualizar la lista de reclamos después de limpiar la caché
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
        <TouchableOpacity style={[styles.actionButton, { marginBottom: 10 }]} onPress={() => navigation.navigate('GenerarReclamoVecino', { mail })}>
          <Ionicons name="add" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Generar Reclamo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { marginBottom: 10 }]} onPress={() => navigation.navigate('BuscarReclamo', { mail })}>
          <Ionicons name="search" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Buscar Reclamo</Text>
        </TouchableOpacity>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Reclamos Del Municipio</Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            value={showMyReclamos}
            onValueChange={setShowMyReclamos}
          />
          <Text style={styles.switchText}>Ver mis reclamos</Text>
        </View>
        {Array.isArray(reclamos) && reclamos.map((reclamo) => (
          <View key={reclamo.idReclamo} style={styles.reclamoCard}>
            <FlatList
              horizontal
              data={imagenesReclamo[reclamo.idReclamo] || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: 200, height: 200, marginBottom: 10 }}
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
        ))}
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
  
  scrollView: {
    padding: 20,
  },
  sectionTitleContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A4E69',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center', // Centrar contenido horizontalmente
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centrar texto
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  switchText: {
    marginLeft: 10,
    fontSize: 16,
  },
  reclamoCard: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  reclamoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  movimientosButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
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
    borderRadius: 10,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
  movimientoContainer: {
    marginBottom: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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

export default ReclamosVecino;

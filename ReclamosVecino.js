import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Switch, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      ? `http://192.168.1.12:8080/inicio/misReclamosVecino?mail=${mail}`
      : 'http://192.168.1.12:8080/inicio/todosReclamos';

    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        setReclamos(data);
        data.forEach(reclamo => {
          fetchImagenesReclamo(reclamo.idReclamo); // Llamar a la función para obtener imágenes
        });
      })
      .catch(error => console.error('Error fetching reclamos:', error));
  };

  const fetchMovimientosReclamo = (idReclamo) => {
    fetch(`http://192.168.1.12:8080/inicio/movimientosReclamo?idReclamo=${idReclamo}`)
      .then(response => response.json())
      .then(data => {
        setMovimientosReclamo(data);
        setModalVisible(true);
      })
      .catch(error => console.error('Error fetching movimientos de reclamo:', error));
  };

  const fetchImagenesReclamo = (idReclamo) => {
    fetch(`http://192.168.1.12:8080/inicio/imagenesReclamo?idReclamo=${idReclamo}`)
      .then(response => response.json())
      .then(data => {
        setImagenesReclamo(prevState => ({
          ...prevState,
          [idReclamo]: data,
        }));
      })
      .catch(error => console.error('Error fetching imagenes de reclamo:', error));
  };

  const handleAddImage = () => {
    // Lógica para agregar una imagen al reclamo
    // Por ejemplo:
    // uploadImageToServer()
    //   .then(() => {
    //     setImagenesReclamo({}); // Limpiar el estado de imágenes para forzar la recarga
    //     fetchReclamos(); // Actualizar la lista de reclamos después de agregar la imagen
    //   })
    //   .catch(error => console.error('Error uploading image:', error));
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
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Reclamos</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('GenerarReclamoVecino', { mail })}>
          <Text style={styles.buttonText}>Generar Reclamo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
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
        {reclamos.map((reclamo) => (
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
              <TouchableOpacity style={styles.imageButton} onPress={handleAddImage}>
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
            <Text style={styles.modalText}>Imágenes del Reclamo:</Text>
            <FlatList
              horizontal
              data={imagenesReclamo}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: 200, height: 200, marginBottom: 10 }}
                />
              )}
            />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3F51B5',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    backgroundColor: '#3F51B5',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
  navText: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },
});

export default ReclamosVecino;

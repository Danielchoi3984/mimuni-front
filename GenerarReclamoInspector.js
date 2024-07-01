import React, { useState, useEffect } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, FlatList, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function GenerarReclamoInspector({ route, navigation }) {
  const [images, setImages] = useState([]);
  const [idSitio, setIdSitio] = useState('');
  const [idDesperfecto, setIdDesperfecto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sitios, setSitios] = useState([]);
  const [desperfectos, setDesperfectos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const { legajo } = route.params || {};

  useEffect(() => {
    getSitios();
    getDesperfectos();
  }, []);

  const getSitios = async () => {
    try {
      const response = await axios.get('http://192.168.0.241:8080/inicio/sitios');
      setSitios(response.data);
    } catch (error) {
      console.error('Error al obtener sitios:', error);
      Alert.alert('Error', 'Error al obtener sitios: ' + error.message);
    }
  };

  const getDesperfectos = async () => {
    try {
      const response = await axios.get(`http://192.168.0.241:8080/inicio/desperfectosPorSector?legajo=${legajo}`);
      console.log('Respuesta de desperfectosPorSector:', response.data); 

      if (Array.isArray(response.data)) {
        setDesperfectos(response.data); 
      } else {
        console.error('Error: La respuesta no es un array válido.');
        Alert.alert('Error', 'Error al obtener desperfectos: La respuesta no es un array válido.');
      }
    } catch (error) {
      console.error('Error al obtener desperfectos:', error);
      Alert.alert('Error', 'Error al obtener desperfectos: ' + error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Resultado del selector de imágenes:', result);

    if (!result.cancelled) {
      const newImages = [...images, result.assets[0]];
      setImages(newImages);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Resultado de la cámara:', result);

    if (!result.cancelled) {
      const newImages = [...images, result.assets[0]];
      setImages(newImages);
    }
  };

  const handleIdSitioPress = () => {
    setModalType('sitio');
    setModalVisible(true);
  };

  const handleIdDesperfectoPress = () => {
    setModalType('desperfecto');
    setModalVisible(true);
  };

  const selectSitio = (sitio) => {
    setIdSitio(sitio.idSitio.toString()); 
    setModalVisible(false);
  };

  const selectDesperfecto = (desperfecto) => {
    setIdDesperfecto(desperfecto.idDesperfecto.toString()); 
    setModalVisible(false);
  };

  const uploadImages = async () => {
    try {
      const formData = new FormData();

      formData.append('legajo', legajo);
      formData.append('idSitio', parseInt(idSitio));  
      formData.append('idDesperfecto', parseInt(idDesperfecto));  
      formData.append('descripcion', descripcion);

      images.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          name: `foto_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await axios.post('http://192.168.0.241:8080/inicio/generarReclamoInspector', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Imágenes y datos subidos exitosamente:', response.data);
      Alert.alert('Éxito', '¡Imágenes y datos subidos exitosamente!');
    } catch (error) {
      console.error('Error al subir imágenes y datos:', error);
      if (error.response) {
        console.log('Datos de respuesta de error:', error.response.data);
        console.log('Estado de respuesta de error:', error.response.status);
        console.log('Encabezados de respuesta de error:', error.response.headers);
      } else if (error.request) {
        console.log('Datos de solicitud de error:', error.request);
      } else {
        console.log('Mensaje de error:', error.message);
      }
      Alert.alert('Error', 'Error al subir imágenes y datos: ' + error.message);
    }
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

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TouchableOpacity style={styles.input} onPress={handleIdSitioPress}>
          <Text>{idSitio ? `Sitio ID: ${idSitio}` : 'Seleccionar Sitio'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={handleIdDesperfectoPress}>
          <Text>{idDesperfecto ? `Desperfecto ID: ${idDesperfecto}` : 'Seleccionar Desperfecto'}</Text>
        </TouchableOpacity>
        <Button title="Seleccionar imagen de la galería" onPress={pickImage} />
        <Button title="Tomar una foto" onPress={takePhoto} />
        <Button title="Subir imágenes" onPress={uploadImages} />
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </View>

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
            <Text style={styles.modalText}>Seleccionar {modalType === 'sitio' ? 'Sitio' : 'Desperfecto'}</Text>
            <FlatList
              data={modalType === 'sitio' ? sitios : desperfectos}
              keyExtractor={(item) => (modalType === 'sitio' ? item.idSitio.toString() : item.idDesperfecto.toString())}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.sitioItem} onPress={() => modalType === 'sitio' ? selectSitio(item) : selectDesperfecto(item)}>
                  <Text>
                    {modalType === 'sitio'
                      ? `${item.idSitio} - ${item.calle} - ${item.numero}`
                      : `${item.idDesperfecto} - ${item.descripcion} - ${item.rubro.descripcion}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosInspector', { legajo })}>
          <Image source={require('./assets/servicios.png')} style={styles.icon} />
          <Text style={styles.navText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ReclamosInspector', { legajo })}>
          <Image source={require('./assets/reclamos.png')} style={styles.icon} />
          <Text style={styles.navText}>Reclamos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('./assets/denuncias.png')} style={styles.icon} />
          <Text style={styles.navText}>Denuncias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PerfilInspector', { legajo })}>
          <Image source={require('./assets/perfil.png')} style={styles.icon} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sitioItem: {
    marginVertical: 10,
  },
});

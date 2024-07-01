import React, { useState, useEffect } from 'react';
import { Button, Image, Text, View, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, FlatList, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const GenerarDenuncia = ({ route, navigation }) => {
  const [images, setImages] = useState([]);
  const [documento, setDocumento] = useState('');
  const [sitio, setSitio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sitios, setSitios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { mail } = route.params || {};

  useEffect(() => {
    getSitios();
  }, []);

  const getSitios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/inicio/sitios');
      setSitios(response.data);
    } catch (error) {
      console.error('Error al obtener sitios:', error);
      Alert.alert('Error', 'Error al obtener sitios: ' + error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Resultado del selector de imágenes:', result);

    if (!result.canceled) {
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

    if (!result.canceled) {
      const newImages = [...images, result.assets[0]];
      setImages(newImages);
    }
  };

  const handleSitioPress = () => {
    setModalVisible(true);
  };

  const selectSitio = (sitio) => {
    setSitio(sitio.idSitio.toString());
    setModalVisible(false);
  };

  const uploadData = async () => {
    Alert.alert(
      'Confirmación',
      'Señor usuario, ¿acepta que todo lo mencionado en esta denuncia es verdad?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Acepto responsabilidad',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('mail', mail);
              formData.append('dniDenunciado', documento);
              formData.append('idSitio', parseInt(sitio));
              formData.append('descripcion', descripcion);
          
              images.forEach((image, index) => {
                formData.append('files', {
                  uri: image.uri,
                  name: `foto_${index}.jpg`,
                  type: 'image/jpeg',
                });
              });
          
              const response = await axios.post('http://localhost:8080/inicio/crearDenuncia', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
          
              console.log('Imágenes y datos subidos exitosamente:', response.data);
          
              // Mostrar el número de denuncia en un Alert si la respuesta es exitosa
              Alert.alert('Éxito', response.data);
          
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
          }
        }
      ]
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

      <View style={styles.content}>
        <Text style={styles.label}>Documento:</Text>
        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
          placeholder="Ingrese el documento"
        />
        <TouchableOpacity style={styles.input} onPress={handleSitioPress}>
          <Text>{sitio ? `Sitio ID: ${sitio}` : 'Seleccionar Sitio'}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese la descripción (máximo 1000 caracteres)"
          multiline
          maxLength={1000}
        />
        <Button title="Seleccionar imagen de la galería" onPress={pickImage} />
        <Button title="Tomar una foto" onPress={takePhoto} />
        <Button title="Enviar denuncia" onPress={uploadData} />
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccionar Sitio</Text>
            <FlatList
              data={sitios}
              keyExtractor={(item) => item.idSitio.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.sitioItem} onPress={() => selectSitio(item)}>
                  <Text>{`${item.idSitio} - ${item.calle} - ${item.numero}`}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
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
    backgroundColor: '#F8F8F8',
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
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A4E69',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sitioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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

export default GenerarDenuncia;
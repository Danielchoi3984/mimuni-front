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
          
              // Limpiar los campos después de enviar la denuncia
              setDocumento('');
              setSitio('');
              setDescripcion('');
              setImages([]);
          
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
        <Text style={styles.title}>Generar Denuncia</Text>
        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
          placeholder="Ingrese el documento"
        />
        <Text style={styles.label}>Sitio</Text>
        <TouchableOpacity style={styles.input} onPress={handleSitioPress}>
          <Text>{sitio ? `Sitio ID: ${sitio}` : 'Seleccionar Sitio'}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Descripción (Máximo 1000 caracteres)</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese la descripción"
          multiline
          maxLength={1000}
        />
        <Text style={styles.label}>Fotos (0/5)</Text>
        <TouchableOpacity style={[styles.input, styles.imageInput]} onPress={pickImage}>
          <Ionicons name="camera" size={24} color="#000" />
          <Text>Agregar Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={uploadData}>
          <Text style={styles.submitButtonText}>Aceptar</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  imageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4A4E69',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  },
  sitioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#4A4E69',
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default GenerarDenuncia;

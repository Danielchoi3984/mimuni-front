import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, FlatList, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const GenerarDenuncia = ({ route, navigation }) => {
  const [documento, setDocumento] = useState('');
  const [sitio, setSitio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotos, setFotos] = useState([]);
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

  const handleDocumentoChange = (text) => {
    setDocumento(text);
  };

  const handleSitioChange = (text) => {
    setSitio(text);
  };

  const handleDescripcionChange = (text) => {
    setDescripcion(text);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true,
    });

    if (!result.cancelled) {
      setFotos([...fotos, result.uri]);
    }
  };

  const handleSitioPress = () => {
    setModalVisible(true);
  };

  const selectSitio = (sitio) => {
    setSitio(sitio.idSitio.toString());
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('mail', mail);
      formData.append('dniDenunciado', documento);
      formData.append('idSitio', sitio);
      formData.append('descripcion', descripcion);
      fotos.forEach((foto, index) => {
        formData.append('files', {
          uri: foto,
          name: `foto${index}.jpg`,
          type: 'image/jpeg',
        });
      });
  
      const response = await axios.post('http://localhost:8080/inicio/crearDenuncia', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Respuesta del servidor:', response.data);
  
      setDocumento('');
      setSitio('');
      setDescripcion('');
      setFotos([]);
    } catch (error) {
      console.error('Error al enviar la denuncia:', error);
      Alert.alert('Error', `Error al enviar la denuncia: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MiMuni</Text>
        <View style={{ width: 20 }}></View>
      </View>

      <Text style={styles.label}>Documento:</Text>
      <TextInput
        style={styles.input}
        value={documento}
        onChangeText={handleDocumentoChange}
        placeholder="Ingrese el documento"
      />

      <Text style={styles.label}>Sitio:</Text>
      <TouchableOpacity style={styles.input} onPress={handleSitioPress}>
        <Text>{sitio ? `Sitio ID: ${sitio}` : 'Seleccionar Sitio'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descripcion}
        onChangeText={handleDescripcionChange}
        placeholder="Ingrese la descripción (máximo 1000 caracteres)"
        multiline
        maxLength={1000}
      />

      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Seleccionar Fotos</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {fotos.map((foto, index) => (
          <Image key={index} source={{ uri: foto }} style={styles.image} />
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Denuncia</Text>
      </TouchableOpacity>

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
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4A4E69',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#8C7D85',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
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
    width: 24,
    height: 24,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    width: '100%',
  },
});

export default GenerarDenuncia;

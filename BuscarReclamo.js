import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BuscarReclamo = ({ route, navigation }) => {
  const [reclamoId, setReclamoId] = useState('');
  const [reclamos, setReclamos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showIndividual, setShowIndividual] = useState(true);
  const { mail } = route.params || {};

  const handleBuscarReclamo = () => {
    const endpoint = showIndividual
      ? `http://localhost:8080/inicio/reclamoPorId?idReclamo=${reclamoId}`
      : `http://localhost:8080/inicio/reclamoPorIdUnificado?idReclamo=${reclamoId}`;

    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        console.log('Datos del reclamo:', data); // Log para verificar los datos recibidos
        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          setReclamos(Array.isArray(data) ? data : [data]);
          return fetch(`http://localhost:8080/inicio/imagenesReclamo?idReclamo=${reclamoId}`);
        } else {
          throw new Error('No se encontraron datos para este reclamo');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor para imágenes');
        }
        return response.json();
      })
      .then(imagenesData => {
        console.log('Datos de imágenes:', imagenesData); // Log para verificar los datos de imágenes
        setImagenes(imagenesData);
        setCurrentImageIndex(0); // Reiniciar el índice de imagen cuando se cargan nuevas imágenes
      })
      .catch(error => console.error('Error fetching reclamo:', error.message));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length);
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Buscar Reclamo</Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, showIndividual ? styles.activeTab : null]}
            onPress={() => setShowIndividual(true)}
          >
            <Text style={[styles.tabText, showIndividual ? styles.activeTabText : null]}>Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, !showIndividual ? styles.activeTab : null]}
            onPress={() => setShowIndividual(false)}
          >
            <Text style={[styles.tabText, !showIndividual ? styles.activeTabText : null]}>Unificado</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese ID"
            value={reclamoId}
            onChangeText={setReclamoId}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleBuscarReclamo}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
        {reclamos.length > 0 && reclamos.map((reclamo, index) => (
          <View key={index} style={styles.reclamoContainer}>
            {imagenes.length > 0 && (
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={handlePrevImage}>
                  <Text style={styles.arrow}>{'<'}</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: imagenes[currentImageIndex] }}
                  style={styles.reclamoImage}
                />
                <TouchableOpacity onPress={handleNextImage}>
                  <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.reclamoText}>ID: {reclamo.idReclamo}</Text>
            <Text style={styles.reclamoText}>Documento: {reclamo.documento}</Text>
            <Text style={styles.reclamoText}>Dirección: {reclamo.direccion}</Text>
            <Text style={styles.reclamoText}>Tipo Desperfecto: {reclamo.tipoDesperfecto}</Text>
            <Text style={styles.reclamoText}>Estado: {reclamo.estado}</Text>
            <Text style={styles.reclamoText}>ID Reclamo Unificado: {reclamo.idReclamoUnificado}</Text>
            <Text style={styles.reclamoText}>Descripción: {reclamo.descripcion}</Text>
          </View>
        ))}
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
    padding: 20,
  },
  sectionTitleContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#4A4E69',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  activeTab: {
    backgroundColor: '#4A4E69',
  },
  tabText: {
    color: '#4A4E69',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    flex: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  searchButton: {
    backgroundColor: '#3F51B5',
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reclamoContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  reclamoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reclamoImage: {
    width: 200,
    height: 200,
  },
  arrow: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  navbar: {
    backgroundColor: '#4A4E69',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
});

export default BuscarReclamo;

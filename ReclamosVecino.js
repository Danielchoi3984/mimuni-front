import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReclamosVecino = ({ route, navigation }) => {
  const [showMyReclamos, setShowMyReclamos] = useState(false);
  const [reclamos, setReclamos] = useState([]);

  const { mail } = route.params || {};

  useEffect(() => {
    if (showMyReclamos) {
      fetch(`http://192.168.1.12:8080/inicio/misReclamosVecino?mail=${mail}`)
        .then(response => response.json())
        .then(data => setReclamos(data))
        .catch(error => console.error('Error fetching mis reclamosPropios:', error));
    } else {
      fetch('http://192.168.1.12:8080/inicio/todosReclamos')
        .then(response => response.json())
        .then(data => setReclamos(data))
        .catch(error => console.error('Error fetching reclamosMunicipio:', error));
    }
  }, [showMyReclamos, mail]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleAddImage = () => {
    // Functionality to add image
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
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('GenerarReclamoVecino',{mail})}>
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
            <TouchableOpacity style={styles.movimientosButton}>
              <Text style={styles.movimientosButtonText}>Movimientos</Text>
            </TouchableOpacity>
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
  scrollView: {
    paddingHorizontal: 15,
    paddingBottom: 60,
  },
  sectionTitleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
  },
  actionButton: {
    backgroundColor: '#8C7D85',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    color: '#8C7D85',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 18,
  },
  reclamoCard: {
    backgroundColor: '#8C7D85',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  reclamoImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  reclamoText: {
    color: '#FFF',
    marginBottom: 5,
  },
  imageButton: {
    backgroundColor: '#4A4E69',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  movimientosButton: {
    backgroundColor: '#4A4E69',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  movimientosButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4A4E69',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    marginBottom: 10,
  },
  navText: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default ReclamosVecino;

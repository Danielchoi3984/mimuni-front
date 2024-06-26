import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ onPressBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPressBack} style={styles.backButton}>
        <Image source={require('./assets/backIcon.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>MiMuni</Text>
    </View>
  );
}

const LoginInicial = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack(); // Navegar a la pantalla anterior
  };

  const handleVecinoPress = () => {
    navigation.navigate('LoginVecino'); // Navegar a la pantalla de LoginVecino
  };

  const handleInspectorPress = () => {
    navigation.navigate('LoginInspector'); // Navegar a la pantalla de LoginInspector
  };


  return (
    <View style={styles.container}>
      <CustomHeader onPressBack={handleBackPress} />
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar SesiÃ³n</Text>
        <TouchableOpacity style={styles.button} onPress={handleVecinoPress}>
          <Text style={styles.buttonText}>Vecino del Municipio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleInspectorPress}>
          <Text style={styles.buttonText}>Inspector Municipal</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 55,
    padding: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9A8C98',
    paddingHorizontal: 150,
    paddingVertical: 40,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginInicial;
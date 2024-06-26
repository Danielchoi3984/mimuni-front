import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PerfilVecinoContext } from './PerfilVecinoContext'; // Ajusta la ruta según tu estructura de archivos

const Perfil = () => {
  const { perfilVecino } = useContext(PerfilVecinoContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Vecino</Text>
      {perfilVecino ? (
        <View style={styles.profileContainer}>
          <Text style={styles.label}>Nombre: {perfilVecino.nombre}</Text>
          <Text style={styles.label}>Apellido: {perfilVecino.apellido}</Text>
          <Text style={styles.label}>Dirección: {perfilVecino.direccion}</Text>
          <Text style={styles.label}>Código de Barrio: {perfilVecino.codigobarrio}</Text>
        </View>
      ) : (
        <Text style={styles.message}>No se ha cargado el perfil del vecino.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2E9E4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    borderWidth: 1,
    borderColor: '#4A4E69',
    borderRadius: 5,
    padding: 10,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default Perfil;

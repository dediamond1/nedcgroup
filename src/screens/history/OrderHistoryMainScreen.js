import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TopHeader } from '../../components/header/TopHeader';

const OrderHistoryMainScreen = ({ navigation }) => {
  const handlePress = (operator) => {
    navigation.navigate("ORDER_HISTORY", {operator});
  };

  return (
    <>
    <TopHeader title={"Välj Operatör"} onPress={()=> navigation.goBack()} icon={true}/>
    <View style={styles.container}>
      <Text style={styles.title}>Välj operatör för att se orderhistorik</Text>
      <Text style={styles.description}>Välj din mobiloperatör för att visa din orderhistorik.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.comviqButton} onPress={() => handlePress('ORDER_HISTORY')}>
          <Text style={styles.buttonText}>Comviq</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lycaButtonContainer} onPress={() => handlePress('LYCA')}>
          <View style={styles.lycaButton}>
            <Image source={require('../../../assets/images/Lycamobile.png')} style={styles.image} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  comviqButton: {
    width: '80%',
    height: 70,
    backgroundColor: '#e2027b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  lycaButtonContainer: {
    width: '80%',
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    borderWidth: 2,
    padding: 5,
    borderColor: '#3b3687',
  },
  lycaButton: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: "ComviqSansWebBold",
    textTransform: "uppercase"
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Changed from 'cover' to 'contain'
  },
});

export default OrderHistoryMainScreen;

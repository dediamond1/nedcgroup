import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TopHeader } from '../../components/header/TopHeader';

const { width, height } = Dimensions.get('window');

const NewsDetailScreen = ({ route, navigation }) => {
  const { newsItem } = route.params;

  return (
    <View style={styles.container}>
        <TopHeader icon={true} title={newsItem?.title} onPress={()=> navigation.goBack()}/>
      <Image
        source={{ uri: 'https://source.unsplash.com/random/800x400/?news' }} // Replace with your image source
        style={styles.image}
        resizeMode="cover"
      />

      {/* Scrollable Content Section */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{newsItem?.title}</Text>
        <Text style={styles.date}>
          Publicerad: {new Date(newsItem.createdAt).toLocaleDateString('sv-SE')}
        </Text>
        <Text style={styles.message}>{newsItem.message}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },


  content: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 28,
    color: '#444',
  },
});

export default NewsDetailScreen;

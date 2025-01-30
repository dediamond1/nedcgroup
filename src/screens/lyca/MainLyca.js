import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { AppText } from '../../components/appText';
import { AppScreen } from '../../helper/AppScreen';
import { TopHeader } from '../../components/header/TopHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { api } from '../../api/api';

const { width, height } = Dimensions.get('window');

const CategoryIcon = ({ name }) => {
  let iconName;
  switch (name) {
    case 'Saldo':
      iconName = 'cash';
      break;
    case 'Fastpris':
      iconName = 'currency-usd';
      break;
    case 'Surf':
      iconName = 'wifi';
      break;
    case 'All in One':
      iconName = 'package-variant-closed';
      break;
    default:
      iconName = 'help-circle';
  }
  return <Icon name={iconName} size={32} color="#e2027b" />;
};

export default function MainLyca({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [categoryName, setCategoryName] = useState()

  const getSubCategories = async (cid) => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      setCategoryName(cid)
      const { data } = await api.get(`/api/lycamobile/categories/`);
      if (data?.categories[cid]?.length > 0) {
        setSelectedCategory(data.categories[cid]);
        setModalVisible(true);
      } else {
        setError('Inga produkter hittades. Kontakta support: +46793394031');
      }
    } catch (error) {
      console.log(error);
      setError('Något gick fel. Kontakta support: +46793394031');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category) => {
    getSubCategories(category);
  };

  const openInfoModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setInfoModalVisible(true);
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const { data } = await api.get('/api/lycamobile/categories/');
      setCategory(Object.keys(data?.categories));
    } catch (error) {
      console.log(error);
      setError('Något gick fel. Kontakta support: +46793394031');
    } finally {
      setLoading(false);
    }
  };

const navigateToDetails = (item)=> {
  setModalVisible(false)
  navigation.navigate('LYCADETAILS', { subcategory: item, categoryName })
}
   
  useEffect(() => {
    fetchCategories();
  }, []);

  const renderSubcategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.subcategoryItem} onPress={()=>navigateToDetails(item) }>
      <View style={styles.subcategoryContent}>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <AppText text={`${item?.name} Kr`} style={styles.subcategoryText} />
          <AppText text={`${item?.data} | ${item?.validity} | Moms: ${item?.moms}`} style={styles.subcategoryInfo} />
          <AppText text={`${item?.InfoPos}`} style={styles.subcategoryDescription} />
        </View>
        <Pressable style={styles.iconContainer} onPress={() => openInfoModal(item)}>
          <Icon name="information-outline" size={24} color="#3b3687" />
        </Pressable>
      </View>
    </TouchableOpacity>
  );

  return (
    <AppScreen style={styles.screen}>
      <TopHeader title="Lyca mobile" textStyle={styles.headerText} icon={'chevron-left'} iconBackground='#3b3687' onPress={()=> navigation.goBack()} style={styles.topHeader} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {category?.length > 0 ? (
          category.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryContainer}
              onPress={() => openModal(cat)}
            >
              <View style={styles.categoryContent}>
                <AppText text={cat} style={styles.categoryTitle} />
              </View>
              <Icon name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.errorContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#e2027b" />
            ) : (
              <AppText text={error || 'Inga kategorier tillgängliga. Kontakta support: +46793394031'} style={styles.errorText} />
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText text="Välj Paket" style={styles.modalHeaderText} />
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#e2027b" />
            ) : (
              <>
                {error ? (
                  <View style={styles.errorContainer}>
                    <AppText text={error} style={styles.errorText} />
                  </View>
                ) : (
                  <FlatList
                    data={selectedCategory}
                    renderItem={renderSubcategoryItem}
                    keyExtractor={(item) => item?.articleId}
                    contentContainerStyle={styles.subcategoriesList}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText text={selectedSubcategory?.name} style={styles.modalHeaderText} />
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.infoModalContent}>
              <View style={styles.detailItem}>
                <AppText text={`Pris: ${selectedSubcategory?.price} kr`} style={styles.detailText} />
                <AppText text={`Data: ${selectedSubcategory?.data}`} style={styles.detailText} />
                <AppText text={`Giltighet: ${selectedSubcategory?.validity}`} style={styles.detailText} />
                <AppText text={`Info: ${selectedSubcategory?.InfoPos}`} style={styles.detailText} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topHeader: {
    backgroundColor: '#3b3687',
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
  },
  scrollViewContent: {
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#3b3687',
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 16,
    textTransform: 'uppercase',
    fontFamily: "ComviqSansWebBold"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#3b3687"

  },
  subcategoriesList: {
    paddingHorizontal: 10,
  },
  subcategoryItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  subcategoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subcategoryText: {
    fontSize: 18,
    color: "#3b3687",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "ComviqSansWebBold"
 
  },
  subcategoryInfo: {
    color: '#000',
    fontSize: 14,
  },
  subcategoryDescription: {
    fontSize: 12,
    color: '#000',
  },
  iconContainer: {
    marginLeft: 8,
  },
  infoModalContent: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
    height: 200,
  },
  errorText: {
    fontSize: 20,
    color: '#3b3687',
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: "bold"
  },
});

import { useState, useRef, useCallback, useEffect, useContext } from "react"
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { TopHeader } from "../../components/header/TopHeader"
import { useNavigation } from "@react-navigation/native"
import { api } from "../../api/api"
import { AuthContext } from "../../context/auth.context"

const { width, height } = Dimensions.get("window")

const TeliaCategoryScreen = ({route}) => {
  const { teliaHalebop, user } = useContext(AuthContext)

  const navigation = useNavigation()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [teliaProducts, setTeliaProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const bottomSheetHeight = height * 0.8
  const bottomSheetTranslateY = useRef(new Animated.Value(bottomSheetHeight)).current
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false)
  const backdropOpacity = useRef(new Animated.Value(0)).current

  

  const getTeliaProducts = async () => {
    try {
      setLoading(true)
      const url = teliaHalebop === "Telia" ? "/api/telia/products/local/telia" : "/api/telia/products/local/halebop"
      const { data } = await api.get(url, {}, {
        headers: {"Authorization": `Bearer ${user}`}
      })
      setTeliaProducts(data?.length ? data : [])
    } catch (error) {
      console.log(error)
      setTeliaProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTeliaProducts()
  }, [teliaHalebop])

  const openBottomSheet = useCallback((category) => {
    setSelectedCategory(category)
    setBottomSheetVisible(true)
    Animated.parallel([
      Animated.spring(bottomSheetTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [bottomSheetTranslateY, backdropOpacity])

  const closeBottomSheet = useCallback(() => {
    Animated.parallel([
      Animated.spring(bottomSheetTranslateY, {
        toValue: bottomSheetHeight,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setBottomSheetVisible(false))
  }, [bottomSheetHeight, bottomSheetTranslateY, backdropOpacity])

  const renderCategoryItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        style={[styles.categoryItem, { backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687" }]}
        onPress={() => openBottomSheet(item)}
      >
        <View style={styles.categoryContent}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.categorySubtext}>
            {item.subcategory.length} {item.subcategory.length === 1 ? 'product' : 'products'}
          </Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    ),
    [openBottomSheet],
  )

  const renderProductItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          closeBottomSheet()
          navigation.navigate("TELIA_DETAIL", { 
            product: {
              id: item.id,
              name: item.id, 
              price: item.value,
              description: item.description,
              articleId: item?.articleId,
              operator: teliaHalebop === "Telia" ? "Telia" : "Halebop"
            } 
          })
        }}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.id}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
        </View>
        <Text style={[styles.productPrice, {color: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>{item.value} kr</Text>
      </TouchableOpacity>
    ),
    [navigation, closeBottomSheet],
  )

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer, {backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>
        <ActivityIndicator size="large" color={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
      </SafeAreaView>
    )
  }else{
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>
        <StatusBar barStyle="light-content" backgroundColor={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
      <View style={styles.container}>
        <TopHeader icon={true} onPress={()=> navigation.goBack()} iconBackground={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} title={ teliaHalebop === "Telia" ? "Telia Products": "Halebop Products"} style={{ backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687" }} />

        {teliaProducts.length > 0 ? (
          <FlatList
            data={teliaProducts}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.category}
            style={styles.categoryList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={48} color={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
            <Text style={[styles.emptyText, {color: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>Något gick fel, vänligen kontakta support</Text>
            <Text style={[styles.emptyText, {color: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>+46793394031</Text>
          </View>
        )}

        {isBottomSheetVisible && (
          <>
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} onTouchStart={closeBottomSheet} />
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: bottomSheetTranslateY }] }]}>
              <View style={[styles.bottomSheetHeader, {backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>
                <Text style={styles.bottomSheetTitle}>{selectedCategory?.category}</Text>
                <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={selectedCategory?.subcategory || []}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                style={styles.productList}
                contentContainerStyle={styles.productListContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 40 }} />}
              />
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
  }

  
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    fontFamily: "azo_sans-700",
  },
  listContent: {
    padding: 16,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContent: {
    flex: 1,
  },
  categoryText: {
    fontSize: 18,
    fontFamily: "azo_sans-700",
    color: "#fff",
    marginBottom: 4,
  },
  categorySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "azo_sans-400",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: "azo_sans-700",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    padding: 16,
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontFamily: "azo_sans-700",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    fontFamily: "azo_sans-400",
  },
  productPrice: {
    fontSize: 18,
    fontFamily: "azo_sans-700",
    marginLeft: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
})

export default TeliaCategoryScreen

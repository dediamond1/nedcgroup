import React, { useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native"
import { TopHeader } from "../../components/header/TopHeader"
import { AppText } from "../../components/appText"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window")

// Operator data for cleaner rendering
const operators = [
  {
    id: "comviq",
    name: "Comviq",
    value: "COMVIQ",
    backgroundColor: "#e2027b",
    textColor: "#ffffff",
    fontFamily: "ComviqSansWebBold",
    textTransform: "uppercase",
    fontSize: 32,
  },
  {
    id: "lyca",
    name: "Lycamobile",
    value: "LYCA",
    borderColor: "#3b3687",
    image: require("../../../assets/images/Lycamobile.png"),
  },
  {
    id: "telia",
    name: "Telia",
    value: "TELIA",
    backgroundColor: "#ec87f2ff",
    textColor: "#ffffff",
    fontFamily: "azo_sans-700",
    textTransform: "uppercase",
    fontSize: 32,
    image: require("../../../assets/images/telialogo.png"),
  },
  {
    id: "halebop",
    name: "Halebop",
    value: "HALEBOP",
    backgroundColor: "#bff6f7ff",
    textColor: "#fff",
    fontFamily: "azo_sans-700",
    textTransform: "uppercase",
    fontSize: 28,
    image: require("../../../assets/images/Haleboplogo.png"),
  }
]

// Reusable operator button component
const OperatorButton = ({ operator, onPress, animationDelay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(animationDelay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  const buttonStyle = [
    styles.operatorButton,
    operator.backgroundColor && { backgroundColor: operator.backgroundColor },
    operator.borderColor && {
      backgroundColor: "#ffffff",
      borderWidth: 2,
      borderColor: operator.borderColor,
    },
    { opacity: fadeAnim, transform: [{ translateY }] },
  ]

  return (
    <Animated.View style={buttonStyle}>
      <TouchableOpacity
        style={styles.buttonTouchable}
        onPress={() => onPress(operator.value)}
        activeOpacity={0.8}
        accessibilityLabel={`Välj ${operator.name}`}
        accessibilityRole="button"
      >
        {operator.image ? (
          <Image source={operator.image} style={styles.operatorImage} />
        ) : (
          <AppText
            text={operator.name}
            style={{
              fontSize: operator.fontSize || 22,
              color: operator.textColor || "#000000",
              fontFamily: operator.fontFamily,
              textTransform: operator.textTransform,
            }}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const OrderHistoryMainScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const titleOpacity = useRef(new Animated.Value(0)).current
  const descriptionOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate title and description on mount
    Animated.stagger(150, [
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handlePress = (operator) => {
    navigation.navigate("ORDER_HISTORY", { operator })
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <TopHeader 
        title="Välj Operatör" 
        onPress={() => navigation.goBack()} 
        icon={true} 
        style={styles.header}
      />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Välj operatör för att se orderhistorik
        </Animated.Text>
        
        <Animated.Text style={[styles.description, { opacity: descriptionOpacity }]}>
          Välj din mobiloperatör för att visa din orderhistorik.
        </Animated.Text>
        
        <View style={styles.buttonContainer}>
          {operators.map((operator, index) => (
            <OperatorButton
              key={operator.id}
              operator={operator}
              onPress={handlePress}
              animationDelay={index * 100}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333333",
    textAlign: "center",
    letterSpacing: 0.2,
    fontFamily: "azo_sans-700",
  },
  description: {
    fontSize: 16,
    marginBottom: 40,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 24,
    fontFamily: "azo_sans-400",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  operatorButton: {
    width: "48%",
    height: 110,
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
  },
  operatorImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
})

export default OrderHistoryMainScreen

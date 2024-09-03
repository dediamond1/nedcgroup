import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../../appText';
import * as Animatable from 'react-native-animatable';
import { AppIconButton } from '../../button/AppIconButton';
export const VoucherItems = ({
  item,
  onPress,
  style,
  textColor = '#fff',
  only,
  info,
  onPressInfo
}) => {
  const { name, price, icon, InfoPos, news, validity, data, vatCardValue } = item || {};

  return (
    <Animatable.View>
      <Pressable
        style={[styles.container, { ...style, padding: only ? 25 : 14 }]}
        activeOpacity={0.9}
        onPress={onPress}>
        <AppText text={name} style={[styles.title, { textAlign: only ? "left" : "center", fontFamily: !only ? "ComviqSansWebBold" : "ComviqSansWebRegular" }]} />
        <View style={styles.descriptionContainer}>

          <AppText text={!only ? data : 'Gäller i ' + validity} style={[styles.description, {
            textAlign: "center", fontSize: !only ? 15 : 16,
          }]} />
          {!only && <AppText
            text={
              item?.subcategory
                ? item?.subcategory[0]?.InfoPos
                : vatCardValue + ' moms'
            }
            style={[styles.description, {
              alignItems: "center",
              justifyContent: "center",

            }]}
          />}

        </View>


      </Pressable>
      {!info && <View style={styles.infoBtn}>
        <AppIconButton icon={"information"} style={{ zIndex: 100 }} size={40} bgColor="#fff" color='#000' onPress={onPressInfo} />
      </View>}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    borderRadius: 14,
    backgroundColor: '#fff',
    marginVertical: 8,
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: '#e2027b',
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "ComviqSansWebBold"

  },
  descriptionContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    

  },
  description: {
    fontSize: 14,
    color: '#000000',
    marginRight: 10,
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: "ComviqSansWebBold",
    textTransform: 'uppercase'
  },
  infoBtn: {
    position: "absolute",
    right: 10,
    top: 40
  }
});

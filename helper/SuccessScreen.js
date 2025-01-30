import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { AppText } from '../src/components/appText';
import { TopHeader } from '../src/components/header/TopHeader';
// import Barcode from 'react-native-barcode-builder';
//import FastImage from 'react-native-fast-image';


export const PurchaseSuccess = ({ loading, onPressPrint, serialNumber, voucherNumber, voucherName, route, barcodeNumber }) => {

    const naviagtion = useNavigation()

    return (

        <Modal visible={true} animationType="slide" style={{ flex: 1 }}>
            <TopHeader title={'Köpbekräftelse'} />

            <View style={styles.container}>
                {loading && <View style={styles.loaderContainer}>
                    <ActivityIndicator animating={true} size={28} />
                </View>}

                <View style={styles.contentContainer}>
                    <View>
                        <AppText text={"Värdekod"} style={styles.contentTitle} />
                        <AppText text={`*110*${voucherNumber}#`} style={styles.contentNumbers} />
                    </View>
                    <View>
                        <AppText text={"Serienummer"} style={styles.contentTitle} />
                        <AppText text={serialNumber} style={styles.contentNumbers} />
                    </View>
                </View>

                <View style={{ width: "100%" }}>
                    {barcodeNumber && <>
                        {/* <BarcodeComponent value={`${barcodeNumber ? barcodeNumber : voucherNumber}`} /> */}
                        <View style={{ padding: 10, width: "95%", height: 120, }}>
                            <Image resizeMode="contain" style={{ width: "100%", height: "100%", }} source={{ uri: barcodeNumber }} />
                        </View>
                        {/* <QRCodeComponent value={`*110*${voucherNumber}#`} size={110} /> */}
                    </>}
                    <TouchableOpacity style={styles.printaVoucherButton} activeOpacity={.6} onPress={() => naviagtion.navigate('INTRO')}>
                        <AppText text={"Tillbaka till huvudmeyn"} style={{ color: "#fff", fontSize: 19, fontFamily: "ComviqSansWebRegular", }} />
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
};

const BarcodeComponent = ({ value, format = "CODE128" }) => {

    return (
        <View style={{ marginVertical: 30 }}>
            <Barcode
                value={value}
                format={format}
                width={2.5}
                height={80}
                lineColor="#000"
                flat={false}
            />
        </View>
    );
};

// const QRCodeComponent = ({ value, size }) => {
//     return (
//         <View style={styles.qrCode}>
//             <QRCode
//                 value={value}
//                 size={size}
//                 color="#000"
//             />
//         </View>
//     );
// };
const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
    },
    loaderContainer: {
        padding: 16,
    },
    QrCodeContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    printaVoucherButton: {
        padding: 14,
        width: "100%",
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b3687"
    },
    homeButton: {
        padding: 14,
        width: "100%",
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,.1)"
    },

    image: {
        backgroundColor: '#F3F3F3',
        width: 150,
        height: 150,
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: 16,
    },
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",

        width: "100%",
        padding: 10
    },
    contentTitle: {
        fontSize: 16,
        fontFamily: "ComviqSansWebBold",
        color: "#000"
    },
    contentNumbers: {
        fontFamily: "ComviqSansWebRegular",
        color: "#000",
        fontSize: 16
    },
    qrCode: {
        marginVertical: 26,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }

})
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { useContext } from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    DeviceEventEmitter,
    NativeEventEmitter,
    Switch,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
    Alert,
} from 'react-native';
import {
    BluetoothEscposPrinter,
    BluetoothManager,

} from '@brooons/react-native-bluetooth-escpos-printer'
import { AppText } from '../../components/appText';
import { AppButton } from '../../components/button/AppButton';
import { apiHelper, baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';
import {
    getBluetooth,
    getToken,
    removeBluetooth,
    saveBluetooth,
} from '../../helper/storage';
import deviceManager from 'react-native-device-info';
import { Status } from '../../../helper/Status';
import { TopHeader } from '../../components/header/TopHeader';
import { Loading } from '../../../helper/Loading';
import { logo } from './logo';
import axios from 'axios';
import { NormalLoader } from '../../../helper/Loader2';
import { PurchaseSuccess } from '../../../helper/SuccessScreen';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';

var { height, width } = Dimensions.get('window');



export const QrCodeScreen = ({ navigation, route }) => {
    const [device, setDevices] = useState(null);
    const [pairedDs, setPairedDs] = useState([]);
    const [foundDs, setFoundDs] = useState([]);
    const [bleOpend, setBleOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [boundAddress, setBoundAddress] = useState(false);
    const [bought, setBought] = useState(false);
    const [name, setName] = useState('');
    const [time, setTime] = useState('')
    const [year, setYear] = useState('')
    const [date, setDate] = useState('')
    const [debugMsg, setDebugMsg] = useState('');



    const { setClosed, setInActive, user, } = useContext(AuthContext);

    // const {}=useGetCompanyInfo()

    const { data, moreInfo, title, compInformation, companyInfo } =
        route.params || {};
    const { id } = compInformation || {};
    //console.log('comp', id);
    const {
        orgNumber,
    } = companyInfo?.manager || {};
    // console.log("context", companyInfo?.manager?.orgNumber);
    const {
        serialNumber,
        voucherNumber,
        expireDate,
        voucherDescription,
        articleId,
        voucherAmount,
        voucherCurrency,
    } = data || {};

    const { InfoPos, ean } = moreInfo || {};

    const getDateTime = async () => {
        try {
            const response = await fetch('http://worldtimeapi.org/api/timezone/Europe/Stockholm');
            const data = await response.json();

            const { datetime } = data;

            // Extract the time and date components from the datetime string
            const time = datetime.substring(11, 16);
            const year = datetime.substring(0, 4);
            const date = datetime.substring(0, 10);

            return { time, year, date };
        } catch (error) {
            console.error('Failed to fetch time and date:', error);
            return null;
        }
    }







    const saveOrder = async () => {
        try {
            setLoading2(true);
            const axiosConf = axios.create({
                baseURL: baseUrl,
                headers: {
                    'Content-type': 'application/json',
                    authorization: `Bearer ${user}`,
                },
            });

            const { data } = await axiosConf.post('/api/order', {
                serialNumber: serialNumber,
                voucherNumber: voucherNumber,
                expireDate: expireDate,
                voucherDescription: voucherDescription,
                articleId: articleId,
                voucherAmount: voucherAmount,
                voucherCurrency: voucherCurrency,
                employeeId: id ? id : null,
            });
            console.log(data);

            if (
                data?.message ===
                'Company deativted because you have reached Credit Limit' 
            ) {
                setInActive(true);
            } else if (data?.message === 'invalid token in the request.') {
                Alert.alert('OBS...', 'DU HAR BLIVIT UTLOGGAD');
                await removeToken();
            } else if (data?.message === 'not valid time to book order.') {
                setClosed(true);
                setLoading2(false);
            } else {
                setBought(true);
                setLoading2(false);
                setLoading2(false);
                await printVoucher();
            }
            setLoading2(false);
        } catch (error) {
            setLoading2(false);
            console.log(error);
        }
    };




    const aboutPrinter = async () => {
        try {
            let _listeners = [];

            BluetoothManager?.checkBluetoothEnabled().then(
                enabled => {
                    setBleOpen(enabled);
                    setLoading(false);
                    // _scan()
                },
                err => {
                    err;
                },
            );

            if (Platform.OS === 'ios') {
                let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
                _listeners.push(
                    bluetoothManagerEmitter.addListener(
                        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                        rsp => {
                            _deviceAlreadPaired(rsp);
                        },
                    ),
                );
                _listeners.push(
                    bluetoothManagerEmitter.addListener(
                        BluetoothManager.EVENT_DEVICE_FOUND,
                        rsp => {
                            _deviceFoundEvent(rsp);
                        },
                    ),
                );
                _listeners.push(
                    bluetoothManagerEmitter.addListener(
                        BluetoothManager.EVENT_CONNECTION_LOST,
                        () => {
                            setBoundAddress('');
                            setName('');
                        },
                    ),
                );
            } else if (Platform.OS === 'android') {
                _listeners.push(
                    DeviceEventEmitter.addListener(
                        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                        rsp => {
                            _deviceAlreadPaired(rsp);
                        },
                    ),
                );
                _listeners.push(
                    DeviceEventEmitter.addListener(
                        BluetoothManager.EVENT_DEVICE_FOUND,
                        rsp => {
                            _deviceFoundEvent(rsp);
                        },
                    ),
                );
                _listeners.push(
                    DeviceEventEmitter.addListener(
                        BluetoothManager.EVENT_CONNECTION_LOST,
                        () => {
                            setName('');
                            setBoundAddress('');
                        },
                    ),
                );
                _listeners.push(
                    DeviceEventEmitter.addListener(
                        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
                        () => {
                            ToastAndroid.show(
                                'Device Not Support Bluetooth !',
                                ToastAndroid.LONG,
                            );
                        },
                    ),
                );
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        deviceManager
            .isEmulator(amu => {

                if (amu) {
                    Alert.alert('OBS', 'this is not a real device!');
                } else {
                    _scan();

                }
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const PrintedTime = async () => {
            try {
                const { year, time, date } = await getDateTime()
                setTime(time)
                setYear(year)
                setDate(date)
            } catch (error) {

            }
        }
        PrintedTime()
    }, [])

    useEffect(() => {
        const isAmu = deviceManager.isEmulatorSync();
        if (isAmu) {
            Alert.alert('ERROR', 'This is NOT a real device!');
        } else {
            (async () => {
                await aboutPrinter();
                const blStorage = await getBluetooth();
                const alreadyPaired = JSON.parse(blStorage);
                if (alreadyPaired?.length > 0) {
                    BluetoothManager.connect(alreadyPaired[0]?.address).then(
                        s => {
                            setLoading(false);
                            setBoundAddress(alreadyPaired[0].address);
                            setName(alreadyPaired[0].name || 'OKÄND');
                        },
                        e => {
                            setLoading(false);
                            alert(e);
                        },
                    );
                } else {
                    if (pairedDs.length > 0 && pairedDs[0].name === 'IposPrinter') {
                        BluetoothManager.connect(pairedDs[0]?.address).then(
                            s => {
                                saveBluetooth(pairedDs)
                                    .then(() => {
                                        setLoading(false);
                                        setBoundAddress(pairedDs[0].address);
                                        setName(pairedDs[0].name || 'OKÄND');
                                    })
                                    .catch(err => console.log('error saving bluetooth', err));
                            },
                            e => {
                                setLoading(false);
                                alert(e);
                            },
                        );
                    }
                }
            })();
        }
        return () => {
            setLoading(false)
            const isAmu = deviceManager.isEmulatorSync();
            if (isAmu) {
                Alert.alert('ERROR', 'This is NOT a real device!');
            } else {
                aboutPrinter();
            }
        };
    }, [boundAddress, pairedDs, foundDs]);

    useEffect(() => {
        if (!bought && boundAddress?.length) {
            saveOrder();
        }
    }, [boundAddress]);
    const printVoucher = async () => {
        let columnWidths = [8, 20, 20];
        try {
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printPic(logo, { width: 300, left: 45 });
            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printText('vardebevis', {
                widthtimes: 2,
            });
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(`${title}`, {});
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(`${moreInfo?.data}`, {});
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText('kod', {
                widthtimes: 1,
            });
            await BluetoothEscposPrinter.printText('\r\n', {});

            await BluetoothEscposPrinter.printText(`${voucherNumber}`, {
                widthtimes: 1,
                fonttype: 1,
            });
            await BluetoothEscposPrinter.printText('\r\n', {});

            await BluetoothEscposPrinter.printerAlign(
                BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printQRCode(
                `*110*${voucherNumber}#`,
                170,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
            );
            await BluetoothEscposPrinter.printText('skanna for att tanka', {
                fonttype: 1,
            });

            await BluetoothEscposPrinter.printText('\r\n', {});
            const formatedDate = moment(new Date(expireDate)).format('YYYY-MM-DD');

            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(
                `koden ar giltigt: ${formatedDate}`,
                {},
            );

            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(
                `Serienummer: ${serialNumber}`,
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});

            await BluetoothEscposPrinter.printText(
                `Tanka ditt kontantkort genom att trycka *110*koden# och lur      eller skanna QR-koden uppe
                `,
                {
                    fonttype: 1,
                },
            );

            await BluetoothEscposPrinter.printText(
                `Kontrollera ditt saldo genom att trycka *111# och lur
                `,
                {
                    fonttype: 1,
                },
            );

            await BluetoothEscposPrinter.printText(
                `For fragor och vilkor kontakta   COMVIQs kundtjanst på 212 eller 0772-21 21 21
                `,
                {
                    fonttype: 1,
                },
            );

            await BluetoothEscposPrinter.printText(
                ` ${companyInfo?.manager?.name?.toUpperCase()}`,
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});

            await BluetoothEscposPrinter.printText(
                `${orgNumber?.toString()?.length > 6
                    ? orgNumber?.toString().slice(0, 6) + '-' + 'XXXX'
                    : orgNumber
                }`,
                {},
            );

            await BluetoothEscposPrinter.printText('\r\n', {});
            const boughtDate = moment(
                new Date().toLocaleString('sv-SE', {
                    timeZone: 'Europe/Stockholm',
                    dateStyle: 'short',
                    hourCycle: 'h24',
                }),
            ).format('YYYY-MM-DD');
            const boughtTime = new Date().toLocaleTimeString('sv-SE', {
                timeZone: 'Europe/Stockholm',
                timeStyle: 'short',
                hourCycle: 'h24',
            });



            await BluetoothEscposPrinter.printText(`Kopt datum och tid:`, {});
            await BluetoothEscposPrinter.printText('\r\n', {});

            await BluetoothEscposPrinter.printText(`${boughtTime ? boughtTime : time}`, {});
            await BluetoothEscposPrinter.printText(` ${boughtDate ? boughtDate : date}`, {});
            await BluetoothEscposPrinter.printText('\r\n', {});


            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
        } catch (e) {
            alert(e.message || 'ERROR');
        }
    };

    const _deviceAlreadPaired = rsp => {
        var ds = null;
        if (typeof rsp.devices == 'object') {
            ds = rsp.devices;
        } else {
            try {
                ds = JSON.parse(rsp.devices);
            } catch (e) { }
        }
        if (ds && ds.length) {
            let pared = pairedDs;
            pared = pared.concat(ds || []);
            setPairedDs(pared);
        }
    };

    const _deviceFoundEvent = rsp => {
        //alert(JSON.stringify(rsp))
        var r = null;
        try {
            if (typeof rsp.device == 'object') {
                r = rsp.device;
            } else {
                r = JSON.parse(rsp.device);
            }
        } catch (e) {
            //alert(e.message);
            //ignore
        }
        //alert('f')
        if (r) {
            let found = foundDs || [];
            if (found.findIndex) {
                let duplicated = found.findIndex(function (x) {
                    return x.address == r.address;
                });
                //CHECK DEPLICATED HERE...
                if (duplicated == -1) {
                    found.push(r);
                    setFoundDs(found);
                }
            }
        }
    };

    const _selfTest = () => {
        setLoading(true);
        BluetoothEscposPrinter.selfTest(() => { });
        setLoading(false);
    };

    const _scan = () => {
        setLoading(true);

        BluetoothManager.scanDevices().then(
            s => {
                var ss = s;
                var found = ss.found;
                try {
                    found = JSON.parse(found); //@FIX_it: the parse action too weired..
                } catch (e) {
                    //ignore
                }
                var fds = foundDs;
                if (found && found.length) {
                    fds = found;
                }
                setFoundDs(fds);
                setLoading(false);
            },
            er => {
                setLoading(false);

                console.log('errrrr', er);
                // alert('error' + JSON.stringify(er));
            },
        );
    };
    const _renderRow = rows => {
        let items = [];
        for (let i in rows) {
            let row = rows[i];
            if (row.address) {
                items.push(
                    <View style={{ padding: 8 }}>
                        <TouchableOpacity
                            key={new Date().getTime() + i}
                            style={styles.wtf}
                            onPress={() => {
                                setLoading(true);
                                BluetoothManager.connect(
                                    pairedDs[0]?.address || row.address,
                                ).then(
                                    s => {
                                        setLoading(false);
                                        setBoundAddress(row.address);
                                        setName(row.name || 'OKÄND');
                                    },
                                    e => {
                                        setLoading(false);
                                        // alert(e);
                                    },
                                );
                            }}>
                            <View style={styles.pairedItems}>
                                <View>
                                    <Text
                                        style={[
                                            styles.name,
                                            { color: row?.name === 'IposPrinter' ? 'blue' : '#222222' },
                                        ]}>
                                        {row.name || 'OKÄND'}
                                    </Text>

                                    {row?.name && (
                                        <Text style={{ color: 'gray', marginVertical: 8 }}>
                                            tryck på den här (standardskrivare)
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.address}>{row.address}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>,
                );
            }
        }
        return items;
    };

    return (
        <>
            {boundAddress && (
                <TopHeader
                    title={'Köpbekräftelse'}
                    icon="chevron-left"
                    onPress={() => navigation.goBack()}
                />
            )}

            {bought ? (
                <PurchaseSuccess
                    voucherNumber={voucherNumber}
                    serialNumber={serialNumber}
                    voucherName={title}
                    barcodeNumber={ean}
                    onPressPrint={() => printVoucher()}
                />
            ) : (
                <>
                    {loading2 && <NormalLoader loading={loading2} />}
                    <>
                        <TopHeader title={!bleOpend ? 'Bluetooth är inte aktiv' : ''} />
                        <ScrollView style={styles.container}>
                            {!boundAddress?.length ? (
                                <>
                                    <Text style={styles.title}>
                                        Blutooth : {bleOpend ? 'Aktiv' : 'Avaktiverat'}{' '}
                                    </Text>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'red',
                                            fontSize: 14,
                                            marginVertical: 10,
                                        }}>
                                        Aktivera bluetooth innan du printer ut en voucher
                                    </Text>
                                    <View>
                                        <Switch
                                            value={bleOpend}
                                            onValueChange={v => {
                                                setLoading(true);
                                                if (!v) {
                                                    BluetoothManager.disableBluetooth().then(
                                                        () => {
                                                            setBleOpen(false);
                                                            setLoading(false);
                                                            setFoundDs([]);
                                                            setPairedDs([]);
                                                        },
                                                        err => {
                                                            alert(err);
                                                        },
                                                    );
                                                } else {
                                                    BluetoothManager?.enableBluetooth().then(
                                                        r => {
                                                            var paired = [];
                                                            if (r && r.length > 0) {
                                                                for (var i = 0; i < r.length; i++) {
                                                                    try {
                                                                        paired.push(JSON.parse(r[i]));
                                                                    } catch (e) {
                                                                        //ignore
                                                                    }
                                                                }
                                                            }
                                                            setBleOpen(true);
                                                            setLoading(false);
                                                            setPairedDs(paired);
                                                        },
                                                        err => {
                                                            setLoading(false);

                                                            alert(err);
                                                        },
                                                    );
                                                }
                                            }}
                                        />

                                        <View style={{ padding: 8 }}>
                                            <Button
                                                disabled={loading || !bleOpend}
                                                onPress={() => {
                                                    _scan();
                                                }}
                                                title="Skanna bluetooth"
                                            />
                                        </View>
                                    </View>

                                    <Text style={styles.title}>
                                        Connected:
                                        <Text style={{ color: 'blue' }}>
                                            {!name ? 'No Devices' : name}
                                        </Text>
                                    </Text>
                                    <Text style={styles.title}>Found(tap to connect):</Text>
                                    {loading ? <ActivityIndicator animating={true} /> : null}
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        {_renderRow(foundDs)}
                                    </View>

                                    {name !== 'IposPrinter' && (
                                        <>
                                            <Text style={styles.title}>Paired:</Text>
                                            {loading ? <ActivityIndicator animating={true} /> : null}
                                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                                {_renderRow(pairedDs)}
                                            </View>
                                        </>
                                    )}
                                    {pairedDs?.length > 0 && (
                                        <View style={styles.btn}>
                                            <View style={{ padding: 10 }}>
                                                <AppButton
                                                    text={
                                                        bought === false
                                                            ? 'Printa voucher'
                                                            : 'Printa vouchern igen'
                                                    }
                                                    onPress={() => saveOrder()}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text>Printer ut voucher...</Text>
                                </View>
                            )}
                        </ScrollView>
                    </>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    title: {
        width: width,
        backgroundColor: '#eee',
        color: '#232323',
        paddingLeft: 8,
        paddingVertical: 4,
        textAlign: 'left',
    },
    wtf: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E5E4E2',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    name: {
        flex: 1,
        textAlign: 'left',
        fontSize: 16,
    },
    address: {
        flex: 1,
        textAlign: 'right',
        fontSize: 13,
    },
    pairedItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    cancelBtnStyle: {
        marginLeft: 10,
        width: '100%',
    },
});

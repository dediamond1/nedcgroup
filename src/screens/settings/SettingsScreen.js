import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/appText';
import { TopHeader } from '../../components/header/TopHeader';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppScreen } from '../../helper/AppScreen';
import CodePush from 'react-native-code-push';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Status } from '../../../helper/Status';
import DeviceInfo from 'react-native-device-info';
import { AppButton } from '../../components/button/AppButton';
import { IconButton } from '../../components/button/IconButton';
import { settingsData } from '../../utils/settingsData';

export const SetttingsScreen = () => {
  const [noUpdateAvailabe, setNoUpdateAvailable] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [updateText, setUpdateText] = useState('Söker efter uppdatering...');
  const navigation = useNavigation();
  const AppVersion = DeviceInfo.getVersion();
  const appkey = 'os-L0ZkZopJi-DC2favaMuQpdPwpCY0QxDls8';
  const getUpdate = async () => {
    try {
      setLoadingStatus(true);
      const updateAvailable = await CodePush.checkForUpdate();
      if (updateAvailable) {
        CodePush.sync(
          {
            checkFrequency: CodePush.CheckFrequency.MANUAL,
            installMode: CodePush.InstallMode.IMMEDIATE,
            deploymentKey: appkey,
            updateDialog: {
              title: 'Ny uppdatering',
              mandatoryContinueButtonLabel: 'Uppdatera nu',
            },
          },
          status => {
            let text;
            switch (status) {
              case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              case CodePush.SyncStatus.AWAITING_USER_ACTION:
                text = 'Söker efter uppdatering...';
                break;
              case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                text = 'Hämtar uppdatering...';
                break;
              case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                text = 'Installerar uppdatering...';
                setLoadingStatus(true);
                setShowProgress(true);
                break;

              case CodePush.SyncStatus.UP_TO_DATE:
                text = 'Appen är redan i senaste uppdateringen.';
                setLoadingStatus(false);
                setNoUpdateAvailable(true);
                break;
              case CodePush.SyncStatus.UNKNOWN_ERROR:
                text = 'Något gick fel när uppdateringen hämtades!...';
                setLoadingStatus(false);
                setNoUpdateAvailable(true);
                break;

              default:
                break;
            }
            setLoadingStatus(false);
            setUpdateText(text);
          },
          downloadProgress => {
            const { receivedBytes, totalBytes } = downloadProgress;
            const progressStatus = Math.ceil(
              (receivedBytes / totalBytes) * 100,
            );
            setProgress(progressStatus);
          },
        );
      } else {
        setLoadingStatus(false);
        setNoUpdateAvailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppScreen
        style={{ flex: 1 }}
        showIcon="true"
        FlatIIconStyle={{ bottom: 120 }}
        iconAction={() => navigation.goBack()}>
        <TopHeader title={'INSTÄLLNINGAR'} loading={loadingStatus} icon={true} onPress={()=> navigation.goBack()} />
        {loadingStatus && (
          <Status
            status={showProgress}
            progress={progress}
            loading={loadingStatus}
            error={noUpdateAvailabe}
            text={updateText}
            onPressCancel={() => setNoUpdateAvailable(false)}
          />
        )}
        {noUpdateAvailabe && (
          <Status
            error={noUpdateAvailabe}
            text={updateText}
            onPressCancel={() => setNoUpdateAvailable(false)}
          />
        )}
        <View style={styles.container}>
          <View style={styles.supportContainer}>
            <FlatList
              data={settingsData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item: { title, color, nav, icon, iconColor } }) => (
                <IconButton
                  backgroundColor={color}
                  title={title}
                  MIcon={icon}
                  color={iconColor}
                  size={42}
                  onPress={() => navigation.navigate(nav)}
                />
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#9F9F9F9F',
                  }}
                />
              )}
            />
          </View>
          <TouchableOpacity style={styles.setting} onPress={getUpdate}>
            <MaterialIcon name="update" size={24} color="#fff" />
            <AppText text={'Uppdatera appen'} style={styles.settingText} />
          </TouchableOpacity>
          <AppText
            text={'NEDC Group AB v1.0.2'}
            style={{ color: '#222222', textAlign: 'center' }}
          />
        </View>
      </AppScreen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  setting: {
    padding: 8,
    backgroundColor: '#e2027b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 4,
    width: '100%',
    elevation: 4,
  },
  settingText: {
    marginLeft: 10,
    fontSize: 15,
  },
  supportContainer: {
    width: '100%',
    flex: 1,
  },
  supportBtn: {
    backgroundColor: '#eee',
    width: '100%',
  },
  supportBtnText: {
    color: '#222222',
  },
});

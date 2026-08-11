import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Crashes from 'appcenter-crashes';
import { Alert, BackHandler } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { AppSideNavigation } from './src/navigations/Home/HomeNavigation';
import { AuthNavigation } from './src/navigations/auth/AuthNavigation';
import { NoNetwork } from './helper/NoNetwork';
import { ClosedShop } from './helper/Closed';
import { AccountStatus } from './src/helper/AccountStatus';
import { NormalLoader } from './helper/Loader2';
import { useGetCompanyInfo } from './src/hooks/useGetCompanyInfo';
import UpdateNotification from './helper/UpdateNotification';
import Announcement from './helper/Announcement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { store } from './src/redux/store';
import { loadStoredToken } from './src/redux/features/auth/authActions';
import { selectToken, selectInActive } from './src/redux/features/auth/authSlice';
import { useLatestVersionQuery, useAnnouncementsQuery } from './src/redux/api/supportApi';

const AppInner = () => {
  const netInfo = useNetInfo();
  const [authLoad, setAuthLoad] = useState(true);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');
  const [announcement, setAnnouncement] = useState(null);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);

  // All auth state is owned by the RTK authSlice — single source of truth.
  const user = useSelector(selectToken);
  const inActive = useSelector(selectInActive);
  const dispatch = useDispatch();

  const {
    loading,
    companyInfo,
    getCompanyInfo,
    setClosed,
    closed,
  } = useGetCompanyInfo();

  // Version check + announcements flow through the RTK Query support API.
  const { data: versionData } = useLatestVersionQuery();
  const { data: announcementsData, isLoading: announcementsLoading } = useAnnouncementsQuery(
    undefined,
    { skip: updateVisible }
  );

  const handleDismissAnnouncement = async () => {
    try {
      if (announcement) {
        await AsyncStorage.setItem('lastAnnouncementId', announcement._id);
        setAnnouncement(null);
      }
    } catch (error) {
      console.error('Error dismissing announcement:', error);
    }
  };

  const remindLater = () => {
    setUpdateVisible(false);
    setTimeout(() => {
      setUpdateVisible(true);
    }, 2 * 60 * 60 * 1000);
  };

  const checkForAppCrash = async () => {
    try {
      const hasCrashedLastSession = await Crashes.hasCrashedInLastSession();
      if (hasCrashedLastSession) {
        Alert.alert(
          'App crash detected',
          'We apologize for the inconvenience. We are working on a fix as soon as possible!'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const accountIsActive = async () => {
    try {
      setAuthLoad(true);
      // Re-hydrate the token from AsyncStorage and re-check company status
      await dispatch(loadStoredToken());
      await getCompanyInfo();
      setAuthLoad(false);
    } catch (error) {
      console.log(error);
      setAuthLoad(false);
    }
  };

  useEffect(() => {
    checkForAppCrash();
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', () => true);
    dispatch(loadStoredToken()).finally(() => setAuthLoad(false));

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Version check: show the update modal when a newer version exists.
  useEffect(() => {
    if (!versionData || versionData.message === "No version information available") {
      return;
    }
    setUpdateUrl(versionData.updateUrl);
    const deviceVersion = DeviceInfo.getVersion();
    setCurrentVersion(deviceVersion);
    if (versionData.latestVersion !== deviceVersion) {
      setUpdateVisible(true);
    }
  }, [versionData]);

  // Announcements: filter + dismiss-once via lastAnnouncementId.
  useEffect(() => {
    if (!announcementsData) return;
    const announcements = Array.isArray(announcementsData)
      ? announcementsData
      : announcementsData?.announcements ?? [];

    // Filter out announcements with type "new"
    const filteredAnnouncements = announcements.filter(
      announcement => announcement.type !== 'news' && new Date(announcement.expirationDate) >= new Date()
    );

    if (filteredAnnouncements.length > 0) {
      AsyncStorage.getItem('lastAnnouncementId').then((lastAnnouncementId) => {
        if (filteredAnnouncements[0]._id !== lastAnnouncementId) {
          setAnnouncement(filteredAnnouncements[0]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcementsData]);

  // Ensure announcements are not shown while the update modal is visible.
  useEffect(() => {
    if (updateVisible) {
      setAnnouncement(null);
    }
  }, [updateVisible]);

  if (netInfo.isInternetReachable === false && netInfo.type !== 'unknown') {
    return <NoNetwork />;
  }

  if (inActive) {
    return <AccountStatus onPress={() => accountIsActive()} />;
  }

  if (loading || authLoad) {
    return (
      <NormalLoader
        loading={loading || authLoad}
        subTitle="Please wait, loading..."
      />
    );
  }

  if (closed) {
    return <ClosedShop />;
  }

  return (
    <NavigationContainer>
      {user ? <AppSideNavigation /> : <AuthNavigation />}
        <UpdateNotification
          visible={updateVisible}
          onClose={() => {
            remindLater();
            setIsAnnouncementPaused(true);
          }}
          updateUrl={updateUrl}
        />
        {announcement && !updateVisible && announcement.type !== 'new' && (
          <Announcement
            type={announcement.type}
            message={announcement.message}
            title={announcement.title}
            onDismiss={() => {
              handleDismissAnnouncement();
              setIsAnnouncementPaused(false);
            }}
            isLoading={announcementsLoading}
          />
        )}
      </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App;

import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Crashes from 'appcenter-crashes';
import { Alert, BackHandler } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { AppSideNavigation } from './src/navigations/Home/HomeNavigation';
import { AuthNavigation } from './src/navigations/auth/AuthNavigation';
import { AuthContext } from './src/context/auth.context';
import { getToken } from './src/helper/storage';
import { NoNetwork } from './helper/NoNetwork';
import { ClosedShop } from './helper/Closed';
import { AccountStatus } from './src/helper/AccountStatus';
import { NormalLoader } from './helper/Loader2';
import { useGetCompanyInfo } from './src/hooks/useGetCompanyInfo';
import UpdateNotification from './helper/UpdateNotification';
import Announcement from './helper/Announcement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from './src/constants/api';
import DeviceInfo from 'react-native-device-info';

const App = () => {
  const netInfo = useNetInfo();
  const [user, setUser] = useState(null);
  const [authLoad, setAuthLoad] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');
  const [announcement, setAnnouncement] = useState(null);
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);
  const [announcementError, setAnnouncementError] = useState(false);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);

  const {
    inActive,
    loading,
    companyInfo,
    setInActive,
    getCompanyInfo,
    setClosed,
    closed,
  } = useGetCompanyInfo();

  const fetchLatestVersion = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/latest-version`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLatestVersion(data.latestVersion);
      setUpdateUrl(data.updateUrl);
      const currentVersion = DeviceInfo.getVersion();
      setCurrentVersion(currentVersion);

      if (data.latestVersion !== currentVersion) {
        setUpdateVisible(true);
      } else {
        // If the version is up-to-date, immediately fetch announcements
        fetchAnnouncement();
      }
    } catch (error) {
      console.error('Error fetching the latest version:', error);
    }
  };

  const fetchAnnouncement = async () => {
    setLoadingAnnouncement(true);
    setAnnouncementError(false);
    try {
      const response = await fetch(`${baseUrl}/api/announcement`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Filter out announcements with type "new"
      const filteredAnnouncements = data.filter(
        announcement => announcement.type !== 'news' && new Date(announcement.expirationDate) >= new Date()
      );
      
      if (filteredAnnouncements.length > 0) {
        const lastAnnouncementId = await AsyncStorage.getItem('lastAnnouncementId');
        if (filteredAnnouncements[0]._id !== lastAnnouncementId) {
          setAnnouncement(filteredAnnouncements[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching the announcement:', error);
      setAnnouncementError(true);
    } finally {
      setLoadingAnnouncement(false);
    }
  };

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
      const jsontoken = await getToken();
      const token = JSON.parse(jsontoken);
      setUser(token);
      setAuthLoad(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForAppCrash();
    accountIsActive();
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', () => true);
    fetchLatestVersion();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
  }, [user]);

  useEffect(() => {
    // Fetch announcements after update modal is handled
    if (!updateVisible) {
      fetchAnnouncement();
    }
  }, [updateVisible]);

  // Ensure announcements are not fetched again if update notification is visible and of type "new"
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        companyInfo,
        setClosed,
        setInActive,
        getCompanyInfo,
      }}>
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
            isLoading={loadingAnnouncement}
          />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;

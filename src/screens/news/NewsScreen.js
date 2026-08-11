import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TopHeader } from '../../components/header/TopHeader';
import { useAnnouncementsQuery } from '../../redux/api/supportApi';

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const { data, isLoading, isError, refetch } = useAnnouncementsQuery();

  // Fetch all news announcements
  useEffect(() => {
    setLoading(isLoading);
    if (isError) {
      setError(true);
      return;
    }
    if (data !== undefined) {
      // API returns { announcements: [...] } — accept both shapes
      const list = Array.isArray(data) ? data : (data?.announcements ?? []);
      // Filter out expired announcements
      const now = new Date();
      const validNews = list.filter(
        announcement => new Date(announcement.expirationDate) >= now && announcement.type === 'news'
      );
      setNews(validNews);
      setError(false);
    }
  }, [data, isLoading, isError]);

  // Refresh news list
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity style={styles.newsItem} onPress={() => handleNewsPress(item)}>
      <View style={styles.iconContainer}>
        <Icon name="newspaper-o" size={20} color="#007bff" style={styles.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      </View>
      <Icon name="chevron-right" size={16} color="#C0C0C0" />
    </TouchableOpacity>
  );

  const handleNewsPress = (newsItem) => {
    navigation.navigate('NEWS_DETAILS', { newsItem }); // Navigate to a detail screen if needed
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Laddar nyheter...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Kunde inte ladda nyheter. Försök igen senare.</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Försök igen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader title={'Nyheter'} icon={true} onPress={()=> navigation.goBack()}/>
      <FlatList
        data={news}
        keyExtractor={item => item._id}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Inga nyheter tillgängliga</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background for a clean look
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  newsItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2bb2e0',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#cccccc"
  
  },
  iconContainer: {
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  icon: {
    marginRight: 0,
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    textTransform: 'capitalize',
    fontFamily: "ComviqSansWebBold"
  },
  message: {
    fontSize: 14,
    color: '#fff',
    fontFamily: "ComviqSansWebRegular",
  lineHeight: 24
    
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6c757d',
    fontSize: 16,
  },
});

export default NewsScreen;

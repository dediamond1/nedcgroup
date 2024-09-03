import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Receipt = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Receipt</Text>
        <Text style={styles.subtitle}>Order #12345</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.item}>Item 1</Text>
        <Text style={styles.item}>Item 2</Text>
        <Text style={styles.item}>Item 3</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.total}>Total: $99.99</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    // Other receipt styles
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  content: {
    marginBottom: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
  },
  footer: {},
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});



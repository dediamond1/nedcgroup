import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const FilterComponent = ({ data, onFilter }) => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleFilter = (filter) => {
        setSelectedFilter(filter);
        onFilter(filter, selectedFromDate, selectedToDate, searchText);
    };

    const handleFromDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        setSelectedFromDate(selectedDate);
    };

    const handleToDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        setSelectedToDate(selectedDate);
    };

    const handleSearch = () => {
        onFilter(selectedFilter, selectedFromDate, selectedToDate, searchText);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filter Options</Text>
            <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'today' && styles.activeFilterButton]}
                onPress={() => handleFilter('today')}
            >
                <Text style={styles.filterButtonText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'thisWeek' && styles.activeFilterButton]}
                onPress={() => handleFilter('thisWeek')}
            >
                <Text style={styles.filterButtonText}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'lastWeek' && styles.activeFilterButton]}
                onPress={() => handleFilter('lastWeek')}
            >
                <Text style={styles.filterButtonText}>Last Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'customDate' && styles.activeFilterButton]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.filterButtonText}>Custom Date</Text>
            </TouchableOpacity>
            {selectedFromDate && (
                <Text style={styles.selectedDateText}>From: {selectedFromDate.toLocaleDateString()}</Text>
            )}
            {selectedToDate && (
                <Text style={styles.selectedDateText}>To: {selectedToDate.toLocaleDateString()}</Text>
            )}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedFromDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleFromDateChange}
                />
            )}
            {showDatePicker && selectedFromDate && (
                <DateTimePicker
                    value={selectedToDate || new Date()}
                    minimumDate={selectedFromDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleToDateChange}
                />
            )}
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    filterButton: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    activeFilterButton: {
        backgroundColor: '#ccc',
    },
    filterButtonText: {
        textAlign: 'center',
        fontSize: 16,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

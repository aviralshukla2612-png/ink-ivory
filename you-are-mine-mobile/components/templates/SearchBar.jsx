import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search templates...',
}) {
  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.inputWrapper}>
        <Search size={18} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9E8E85"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
            <X size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Button */}
      {onFilterPress ? (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default SearchBar;

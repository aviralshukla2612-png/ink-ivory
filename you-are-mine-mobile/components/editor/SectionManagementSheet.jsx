import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LayoutGrid, Plus, Trash2, X, Calendar, Clock, MapPin } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore } from '../../store/editor.store';

export function SectionManagementSheet() {
  const { events, updateEvent, addEvent, removeEvent, setActiveTool } = useEditorStore();

  const [newEventName, setNewEventName] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');

  const handleAddEvent = () => {
    if (!newEventName.trim()) {
      Alert.alert('Incomplete Event', 'Please specify the ceremony or event title.');
      return;
    }

    addEvent({
      name: newEventName.trim(),
      date: 'Saturday, Dec 19 2026',
      time: newEventTime.trim() || '7:00 PM Onwards',
      venue: newEventVenue.trim() || 'Temple Mandapam',
    });

    setNewEventName('');
    setNewEventTime('');
    setNewEventVenue('');
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <LayoutGrid size={18} color={Colors.primary} />
          <Text style={styles.title}>Wedding Sections & Timeline</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setActiveTool(null)}
          activeOpacity={0.7}
        >
          <X size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>Ceremony Timeline Events ({events.length})</Text>

        {/* Existing Events List */}
        {events.map((item, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventHeaderRow}>
              <TextInput
                style={styles.eventNameInput}
                value={item.name}
                onChangeText={(text) => updateEvent(index, { name: text })}
                placeholder="Ceremony Name"
              />
              {events.length > 1 ? (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => removeEvent(index)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={15} color={Colors.error} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.eventDetailsRow}>
              <View style={styles.fieldItem}>
                <Clock size={12} color={Colors.textSecondary} />
                <TextInput
                  style={styles.miniInput}
                  value={item.time}
                  onChangeText={(text) => updateEvent(index, { time: text })}
                  placeholder="Time"
                />
              </View>

              <View style={styles.fieldItem}>
                <MapPin size={12} color={Colors.textSecondary} />
                <TextInput
                  style={styles.miniInput}
                  value={item.venue}
                  onChangeText={(text) => updateEvent(index, { venue: text })}
                  placeholder="Venue"
                />
              </View>
            </View>
          </View>
        ))}

        {/* Add New Ceremony Event Form */}
        <View style={styles.addSectionBox}>
          <Text style={styles.addSectionTitle}>+ Add Ceremony Event</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Event Name (e.g. Sangeet & Dinner)"
            placeholderTextColor="#A89B92"
            value={newEventName}
            onChangeText={setNewEventName}
          />
          <View style={styles.rowTwo}>
            <TextInput
              style={[styles.inputField, { flex: 1 }]}
              placeholder="Time (e.g. 7:30 PM)"
              placeholderTextColor="#A89B92"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />
            <TextInput
              style={[styles.inputField, { flex: 1.5 }]}
              placeholder="Venue"
              placeholderTextColor="#A89B92"
              value={newEventVenue}
              onChangeText={setNewEventVenue}
            />
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddEvent}
            activeOpacity={0.8}
          >
            <Plus size={15} color={Colors.textLight} />
            <Text style={styles.addBtnText}>Add Ceremony Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
    height: 330,
    elevation: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    paddingBottom: 28,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  eventCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventNameInput: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniInput: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
    paddingVertical: 2,
  },
  addSectionBox: {
    backgroundColor: Colors.cream,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    marginTop: 6,
  },
  addSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  inputField: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textLight,
  },
});

export default SectionManagementSheet;

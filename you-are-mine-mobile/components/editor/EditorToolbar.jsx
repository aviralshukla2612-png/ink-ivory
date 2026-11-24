import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Type, Image as ImageIcon, Music2, LayoutGrid, Sliders } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useEditorStore } from '../../store/editor.store';

const TOOLS = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'sections', label: 'Sections', icon: LayoutGrid },
  { id: 'style', label: 'Style', icon: Sliders },
];

export function EditorToolbar() {
  const { activeTool, setActiveTool, selectedElementId, selectElement } = useEditorStore();

  const handleToolPress = (toolId) => {
    if (toolId === 'text') {
      if (!selectedElementId) {
        selectElement('names'); // default to couple names
      }
      setActiveTool('text');
      return;
    }

    if (toolId === 'style') {
      if (!selectedElementId) {
        selectElement('names');
      }
      setActiveTool('style');
      return;
    }

    if (toolId === 'images') {
      setActiveTool('images');
      return;
    }

    if (toolId === 'music') {
      setActiveTool('music');
      return;
    }

    if (toolId === 'sections') {
      setActiveTool('sections');
      return;
    }

    setActiveTool(toolId);
  };


  return (
    <View style={styles.container}>
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;

        return (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolItem, isActive && styles.activeToolItem]}
            onPress={() => handleToolPress(tool.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
              <Icon
                size={20}
                color={isActive ? Colors.primary : Colors.textPrimary}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
            </View>
            <Text style={[styles.toolLabel, isActive && styles.activeToolLabel]}>
              {tool.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  toolItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  activeToolItem: {
    backgroundColor: 'rgba(116, 30, 50, 0.08)',
  },
  iconBox: {
    marginBottom: 4,
  },
  activeIconBox: {
    transform: [{ scale: 1.05 }],
  },
  toolLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  activeToolLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default EditorToolbar;

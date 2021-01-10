import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SpotterOption } from '../core';
import { IconImageNative } from '../native';
import { useTheme } from './theme.component';

type OptionsProps = {
  options: SpotterOption[];
  selectedIndex: number;
  executing: boolean,
  onSubmit: (option: SpotterOption) => void;
  style: ViewStyle;
}

export const Options = ({ options, selectedIndex, executing, onSubmit, style }: OptionsProps) => {

  const [ref, setRef] = useState<FlatList | null>(null);

  useEffect(() => {
    if (!ref) {
      return;
    }

    const nextSelectedIndex = selectedIndex - 1 < 0
      ? 0
      : selectedIndex - 1;

    ref.scrollToIndex({ index: nextSelectedIndex, animated: true });

  }, [selectedIndex])

  return <>
    {options.length ?
      <FlatList
        style={style}
        data={options}
        ref={setRef}
        keyExtractor={item => item.title + item.subtitle}
        persistentScrollbar={true}
        renderItem={({ item, index }: { item: SpotterOption, index: number }) => (
          <Option
            item={item}
            selected={selectedIndex === index}
            executing={executing}
            onSubmit={onSubmit}
          />
        )}
      />
    : null}
  </>
};

const Option = ({
  item,
  selected,
  executing,
  onSubmit,
}: {
  item: SpotterOption,
  selected: boolean,
  executing: boolean,
  onSubmit: (option: SpotterOption) => void,
}) => {

  const { colors } = useTheme();

  return (
    <View
      key={item.title + item.subtitle}
      style={{
        ...styles.option,
        ...(selected ? styles.activeOption : {}),
        backgroundColor: colors.background,
        ...(selected ? { backgroundColor: colors.active.background } : {}),
      }}
      onTouchEnd={() => onSubmit(item)}
    >
      {item?.icon
        ? <View style={styles.imageContainer}>
          {typeof item?.icon === 'string' && item?.icon.endsWith('.app')
            ? <IconImageNative style={{ width: 25, height: 25 }} source={item?.icon}></IconImageNative>
            : typeof item?.icon === 'number'
              ? <Image style={{ width: 22, height: 22 }} source={item?.icon}></Image>
              : null
          }
        </View>
        : null
      }
      <View>
        <Text style={{
          color: colors.text,
          ...(selected ? { color: colors.active.text } : {}) }
        }>{item.title}</Text>
        <Text style={{
          color: colors.description,
          ...styles.subtitle,
          ...(selected ? { color: colors.active.description } : {}),
        }}>{item.subtitle}</Text>
      </View>
      {executing && selected ? <ActivityIndicator size='small' color='#ffffff' style={styles.spinner} /> : null}
    </View>
  )
};

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    right: 10,
  },
  activeOption: {
    borderBottomColor: 'transparent',
  },
  option: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
  },
  imageContainer: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5
  },
});

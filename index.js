import React, { useState, useRef, memo, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
    findNodeHandle,
    UIManager,
} from 'react-native';
import { useTheme } from 'styled-components/native';
import {
    Container,
    TriggerButton,
    TriggerText,
    CustomChevron,
    DropdownContainer,
    DropdownOverlay,
    OptionItem,
    OptionText,
    HintText,
    LabelText,
} from './style';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ITEM_HEIGHT = 48;

const SELECT_SIZES = {
    small: {
        height: 36,
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingRight: 16,
        fontSize: 14,
        iconSize: 18,
    },
    medium: {
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingRight: 15,
        fontSize: 16,
        iconSize: 25,
    },
    large: {
        height: 54,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingRight: 13,
        fontSize: 18,
        iconSize: 28,
    },
};

const Select = memo(({
    label,
    placeholder = '선택하세요',
    options = [],
    value,
    onChange,
    size = 'medium',
    state = 'default',
    hint,
    disabled = false,
    required = false,
    ...props
}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const triggerRef = useRef(null);
    const flatListRef = useRef(null);

    const getColors = () => {
        const base = {
            border: theme.color.outline,
            background: theme.color.surface,
            text: theme.color.onSurface,
            placeholder: theme.color.onSurfaceVariant,
        };

        if (state === 'error') {
            return { ...base, border: theme.color.error || '#D32F2F' };
        }

        if (state === 'disabled') {
            return {
                ...base,
                background: theme.color.disabled,
                text: theme.color.onDisabled,
                border: theme.color.outlineVariant,
            };
        }

        return base;
    };

    const colors = getColors();
    const sizeConfig = SELECT_SIZES[size];
    const selectedOption = options.find(option => option.value === value);

    const calculatePosition = () => {
        if (!triggerRef.current) return;

        const handle = findNodeHandle(triggerRef.current);
        if (!handle) return;

        UIManager.measureInWindow(handle, (x, y, width, height) => {
            const screenHeight = Dimensions.get('window').height;
            const dropdownHeight = Math.min(options.length * ITEM_HEIGHT, 200);

            const spaceBelow = screenHeight - (y + height);
            const spaceAbove = y;

            const top =
                spaceBelow < dropdownHeight && spaceAbove > spaceBelow
                    ? y - dropdownHeight + 1
                    : y + height - 1;

            setDropdownPosition({
                top: Math.max(0, top),
                left: x,
                width,
            });
        });
    };

    const getSelectedIndex = () =>
        options.findIndex(option => option.value === value);

    const toggleDropdown = () => {
        if (disabled) return;
        if (!isOpen) calculatePosition();
        setIsOpen(prev => !prev);
    };

    const selectOption = useCallback(
        (option) => {
            if (option.disabled) return;
            onChange?.(option.value);
            setIsOpen(false);
        },
        [onChange]
    );

    const renderOption = useCallback(
        ({ item, index }) => (
            <OptionItem
                key={item.value}
                onPress={() => selectOption(item)}
                isSelected={item.value === value}
                isDisabled={item.disabled}
                isFirst={index === 0}
                isLast={index === options.length - 1}
                theme={theme}
                disabled={item.disabled}
            >
                {item.value === value && (
                    <MaterialIcons
                        style={{ marginLeft: 3 }}
                        name="check"
                        size={20}
                        color={theme.color.onPrimary}
                    />
                )}
                <OptionText
                    isSelected={item.value === value}
                    isDisabled={item.disabled}
                    theme={theme}
                >
                    {item.label}
                </OptionText>
            </OptionItem>
        ),
        [value, theme, selectOption, options.length]
    );

    const getItemLayout = useCallback(
        (data, index) => {
            let offsetCorrection = -10;

            if (index === options.length - 1) {
                offsetCorrection = 10;
            }

            return {
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index + offsetCorrection,
                index,
            };
        },
        [options.length]
    );

    return (
        <Container {...props}>
            {label && (
                <LabelText theme={theme}>
                    {label}
                    {required && <Text style={{ color: theme.error.main }}> *</Text>}
                </LabelText>
            )}

            <TriggerButton
                ref={triggerRef}
                onPress={toggleDropdown}
                disabled={disabled}
                colors={colors}
                sizeConfig={sizeConfig}
                state={state}
                theme={theme}
            >
                <TriggerText
                    colors={colors}
                    sizeConfig={sizeConfig}
                    hasValue={!!selectedOption}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </TriggerText>

                <CustomChevron size={sizeConfig.iconSize}>
                    <MaterialIcons
                        name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={sizeConfig.iconSize}
                        color={disabled ? colors.text : colors.placeholder}
                    />
                </CustomChevron>
            </TriggerButton>

            {hint && (
                <HintText colors={colors} state={state} theme={theme}>
                    {hint}
                </HintText>
            )}

            <Modal
                visible={isOpen}
                transparent
                animationType="none"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={() => setIsOpen(false)}
            >
                {isOpen && (
                    <DropdownOverlay activeOpacity={1} onPress={() => setIsOpen(false)}>
                        <DropdownContainer
                            position={dropdownPosition}
                            theme={theme}
                            onStartShouldSetResponder={() => true}
                        >
                            <FlatList
                                ref={flatListRef}
                                data={options}
                                extraData={value}
                                renderItem={renderOption}
                                keyExtractor={(item) => item.value}
                                showsVerticalScrollIndicator
                                persistentScrollbar
                                maxToRenderPerBatch={5}
                                windowSize={7}
                                initialNumToRender={10}
                                initialScrollIndex={Math.max(0, getSelectedIndex())}
                                getItemLayout={getItemLayout}
                            />
                        </DropdownContainer>
                    </DropdownOverlay>
                )}
            </Modal>
        </Container>
    );
});

export default Select;

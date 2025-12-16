import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const LabelText = styled.Text`
  font-family: 'pretend-medium';
  font-size: 14px;
  color: ${(props) => props.theme.color.onSurface};
  margin-bottom: 8px;
`;

export const TriggerButton = styled.TouchableOpacity`
  height: ${(props) => props.sizeConfig.height}px;
  padding: 0 ${(props) => props.sizeConfig.paddingHorizontal}px;
  padding-right: ${(props) => props.sizeConfig.paddingRight}px;
  background-color: ${(props) => props.colors.background};
  border-width: ${(props) => (props.state === 'error' ? 2 : 1)}px;
  border-color: ${(props) => props.colors.border};
  border-radius: ${(props) => props.sizeConfig.borderRadius}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${(props) => props.disabled && 'opacity: 0.6;'}
`;

export const TriggerText = styled.Text`
  flex: 1;
  font-family: 'pretend-regular';
  font-size: ${(props) => props.sizeConfig.fontSize}px;
  color: ${(props) =>
    props.hasValue ? props.colors.text : props.colors.placeholder};
`;

export const CustomChevron = styled.View`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  justify-content: center;
  align-items: center;
`;

export const DropdownOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9999;
`;

export const DropdownContainer = styled.View`
  position: absolute;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
  width: ${(props) => props.position.width}px;
  max-height: 200px;
  background-color: ${(props) => props.theme.color.surface};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.outline};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
  overflow: hidden;
  z-index: 10000;
`;

export const OptionItem = styled.TouchableOpacity`
  height: 48px;
  padding: 0 5px;
  margin: 0px 10px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) =>
    props.isDisabled
      ? 'transparent'
      : props.isSelected
      ? props.theme.color.primary
      : 'transparent'};
  opacity: ${(props) => (props.isDisabled ? 0.4 : 1)};
  gap: 5px;

  ${(props) =>
    props.isSelected &&
    props.isFirst &&
    `
    margin-top: 10px;
  `}

  ${(props) =>
    props.isSelected &&
    props.isLast &&
    `
    margin-bottom: 10px;
  `}
`;

export const OptionText = styled.Text`
  font-family: 'pretend-regular';
  font-size: 16px;
  color: ${(props) =>
    props.isDisabled
      ? props.theme.color.onDisabled
      : props.isSelected
      ? props.theme.color.onPrimary
      : props.theme.color.onSurface};
  flex: 1;
`;

export const HintText = styled.Text`
  font-family: 'pretend-regular';
  font-size: 12px;
  color: ${(props) =>
    props.state === 'error'
      ? props.colors.border
      : props.theme.color.onSurfaceVariant};
  margin-top: 4px;
`;

import {showMessage} from 'react-native-flash-message';

export const showSuccess = (message, description = '') => {
  showMessage({
    message: message,
    description: description,
    type: 'success',
    icon: 'success',
    duration: 3000,
    hideOnPress: true,
    floating: true,
    style: {borderRadius: 10, marginHorizontal: 10, marginTop: 30},
  });
};

export const showError = (message, description = '') => {
  showMessage({
    message: message,
    description: description,
    type: 'danger',
    icon: 'danger',
    duration: 4000,
    hideOnPress: true,
    floating: true,
    style: {borderRadius: 10, marginHorizontal: 10, marginTop: 30},
  });
};

export const showInfo = (message, description = '') => {
  showMessage({
    message: message,
    description: description,
    type: 'info',
    icon: 'info',
    duration: 3000,
    hideOnPress: true,
    floating: true,
    style: {borderRadius: 10, marginHorizontal: 10, marginTop: 30},
  });
};

export const showAlert = (
  message,
  description = '',
  backgroundColor = '#333',
  textColor = '#fff',
) => {
  showMessage({
    message: message,
    description: description,
    backgroundColor: backgroundColor,
    color: textColor,
    duration: 3500,
    hideOnPress: true,
    floating: true,
    style: {borderRadius: 10, marginHorizontal: 10, marginTop: 30},
  });
};

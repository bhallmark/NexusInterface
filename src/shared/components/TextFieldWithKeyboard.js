// External
import { useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

// Internal
import TextField from 'components/TextField';
import MaskableTextField from 'components/MaskableTextField';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import Button from 'components/Button';
import store from 'store';
import keyboardIcon from 'icons/keyboard.svg';

export default function TextFieldWithKeyboard({
  value,
  onChange,
  placeholder,
  maskable,
  skin,
  ...rest
}) {
  const handleInputChange = useCallback((evt, text) => {
    onChange(text);
  }, []);

  const openKeyboard = () => {
    ipcRenderer.on('keyboard-input-change', handleInputChange);
    ipcRenderer.once('keyboard-closed', () => {
      ipcRenderer.off('keyboard-input-change', handleInputChange);
    });
    ipcRenderer.invoke('open-virtual-keyboard', {
      theme: store.getState().theme,
      defaultText: value,
      maskable: maskable,
      placeholder: placeholder,
    });
  };

  useEffect(
    () => () => {
      ipcRenderer.off('keyboard-input-change', handleInputChange);
    },
    []
  );

  const Component = maskable ? MaskableTextField : TextField;

  return (
    <Component
      {...{ value, onChange, placeholder, skin }}
      skin={skin}
      onChange={onChange}
      {...rest}
      left={
        <Tooltip.Trigger align="start" tooltip={__('Use virtual keyboard')}>
          <Button
            skin="plain"
            onClick={openKeyboard}
            tabIndex="-1"
            style={
              skin === 'filled' || skin === 'filled-inverted'
                ? { paddingRight: 0 }
                : { paddingLeft: 0 }
            }
          >
            <Icon icon={keyboardIcon} />
          </Button>
        </Tooltip.Trigger>
      }
    />
  );
}

// TextFieldWithKeyboard wrapper for redux-form
const TextFieldWithKeyboardReduxForm = ({ input, meta, ...rest }) => (
  <TextFieldWithKeyboard
    error={meta.touched && meta.error}
    {...input}
    {...rest}
  />
);
TextFieldWithKeyboard.RF = TextFieldWithKeyboardReduxForm;

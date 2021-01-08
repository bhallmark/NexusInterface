import { initialize, reset } from 'redux-form';

import { history } from 'lib/wallet';
import store from 'store';

export const formName = 'send';

export const defaultRecipient = {
  address: null,
  amount: '',
  fiatAmount: '',
};

export const defaultValues = {
  sendFrom: null,
  recipients: [defaultRecipient],
  reference: null,
  expires: null,
};

export function goToSend(formValues) {
  store.dispatch(initialize(formName, { ...defaultValues, ...formValues }));
  store.dispatch(reset(formName));
  history.push('/Send');
}

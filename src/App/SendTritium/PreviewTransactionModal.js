import { useState, useEffect, useMemo, Fragment } from 'react';
import styled from '@emotion/styled';
import { reduxForm, Field } from 'redux-form';

import Modal from 'components/Modal';
import NexusAddress from 'components/NexusAddress';
import Icon from 'components/Icon';
import TokenName from 'components/TokenName';
import Button from 'components/Button';
import TextFieldWithKeyboard from 'components/TextFieldWithKeyboard';
import { callApi } from 'lib/tritiumApi';
import { lookupAddress } from 'lib/addressBook';
import { openSuccessDialog, removeModal } from 'lib/ui';
import { loadAccounts } from 'lib/user';
import { errorHandler } from 'utils/form';
import addressBookIcon from 'icons/address-book.svg';
import sendIcon from 'icons/send.svg';

__ = __context('PreviewTransaction');

const Layout = styled.div({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  columnGap: '1em',
  rowGap: '1em',
  paddingBottom: 20,
});

const LabelCell = styled.div({
  gridColumn: '1 / span 1',
  textAlign: 'left',
});

const ContentCell = styled.div({
  gridColumn: '2 / span 1',
});

const Label = styled.div(({ theme }) => ({
  textTransform: 'uppercase',
  fontSize: '0.9em',
  color: theme.mixer(0.625),
}));

const Content = styled.div(({ theme }) => ({
  color: theme.foreground,
}));

const SourceName = styled.span(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.foreground,
}));

const UnNamed = styled(SourceName)(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.mixer(0.8),
}));

const RecipientName = styled.span(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.foreground,
}));

const Separator = styled.div(({ theme }) => ({
  gridColumn: '1 / span 2',
  height: 1,
  backgroundColor: theme.mixer(0.125),
}));

const SubmitButton = styled(Button)({
  fontSize: 16,
});

function Source({ source }) {
  const { name, address } = source?.account || source?.token || {};
  return (
    <NexusAddress
      address={address}
      label={
        name ? (
          <SourceName>{name}</SourceName>
        ) : (
          <UnNamed>{__('Unnamed account')}</UnNamed>
        )
      }
    />
  );
}

function NameTo({ name }) {
  const [address, setAddress] = useState(null);
  useEffect(() => {
    (async () => {
      const nameRecord = await callApi('names/get/name', { name });
      setAddress(nameRecord?.register_address);
    })();
  }, []);
  return (
    <NexusAddress
      label={<RecipientName>{name}</RecipientName>}
      address={address || ''}
    />
  );
}

function AddressTo({ address }) {
  const contactName = useMemo(() => {
    const contact = lookupAddress(address);
    if (!contact) return null;
    return contact.name + (contact.label ? ' - ' + contact.label : '');
  }, [address]);
  return (
    <NexusAddress
      address={address}
      label={
        !!contactName && (
          <span>
            <Icon icon={addressBookIcon} />
            <span className="ml0_4 v-align">{contactName}</span>
          </span>
        )
      }
    />
  );
}

function renderExpiry(timeSpan) {
  let string = '';
  let seconds = timeSpan;

  const days = Math.floor(seconds / 86400);
  if (days) {
    string += __('%{smart_count} day |||| %{smart_count} days', days) + ' ';
  }
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  if (hours) {
    string += __('%{smart_count} hour |||| %{smart_count} hours', hours) + ' ';
  }
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  if (minutes) {
    string +=
      __('%{smart_count} minute |||| %{smart_count} minutes', minutes) + ' ';
  }

  seconds %= 60;
  if (seconds) {
    string +=
      __('%{smart_count} second |||| %{smart_count} seconds', seconds) + ' ';
  }

  if (days || minutes || hours) {
    string += `(${__(
      '%{smart_count} second |||| %{smart_count} seconds',
      timeSpan
    )})`;
  }
  return __('in %{time_span}', { time_span: string });
}

const formOptions = {
  form: 'preview_tx',
  destroyOnUnmount: true,
  initialValues: {
    pin: '',
  },
  validate: ({ pin }) => {
    const errors = {};
    if (!pin || pin.length < 4) {
      errors.pin = __('Pin must be at least 4 characters');
    }
    return errors;
  },
  onSubmit: async ({ pin }, dispatch, { source, recipients }) => {
    const params = {
      pin,
      recipients,
    };

    if (source?.token) {
      params.address = source.token.address;
      return await callApi('tokens/debit/token', params);
    } else {
      params.address = source.account.address;
      return await callApi('finance/debit/account', params);
    }
  },
  onSubmitSuccess: (result, dispatch, { modalId, resetSendForm }) => {
    if (!result) return;

    resetSendForm();
    loadAccounts();
    removeModal(modalId);
    openSuccessDialog({
      message: __('Transaction sent'),
    });
  },
  onSubmitFail: errorHandler(__('Error sending transaction')),
};

function PreviewTransactionModal({
  source,
  recipients,
  handleSubmit,
  submitting,
}) {
  return (
    <Modal>
      <Modal.Header>{__("You're sending")}</Modal.Header>
      <Modal.Body>
        <Layout>
          <LabelCell>
            <Label>{__('From')}</Label>
          </LabelCell>
          <ContentCell>
            <Source source={source} />
          </ContentCell>

          {recipients.map(
            ({ name_to, address_to, amount, reference, expires }, i) => (
              <Fragment key={i}>
                <Separator />

                <LabelCell>
                  <Label>{__('To')}</Label>
                </LabelCell>
                <ContentCell>
                  <ContentCell>
                    {name_to && <NameTo name={name_to} />}
                    {address_to && <AddressTo address={address_to} />}
                  </ContentCell>
                </ContentCell>

                <LabelCell>
                  <Label>{__('Amount')}</Label>
                </LabelCell>
                <ContentCell>
                  <ContentCell>
                    <Content>
                      {amount}{' '}
                      <TokenName
                        account={source?.account}
                        token={source?.token}
                      />
                    </Content>
                  </ContentCell>
                </ContentCell>

                {!!reference && (
                  <>
                    <LabelCell>
                      <Label>{__('Reference')}</Label>
                    </LabelCell>
                    <ContentCell>
                      <ContentCell>{reference}</ContentCell>
                    </ContentCell>
                  </>
                )}

                {(!!expires || expires === 0) && (
                  <>
                    <LabelCell>
                      <Label>{__('Expires')}</Label>
                    </LabelCell>
                    <ContentCell>
                      <ContentCell>{renderExpiry(expires)}</ContentCell>
                    </ContentCell>
                  </>
                )}
              </Fragment>
            )
          )}
        </Layout>
      </Modal.Body>

      <Modal.Footer>
        <form onSubmit={handleSubmit} style={{ marginTop: -20 }}>
          <Field
            component={TextFieldWithKeyboard.RF}
            maskable
            name="pin"
            autoFocus
            skin="filled-inverted"
            placeholder={__('Enter your PIN to confirm')}
          />

          <SubmitButton
            type="submit"
            skin="primary"
            uppercase
            wide
            disabled={submitting}
            className="mt1"
          >
            <Icon icon={sendIcon} />
            <span className="ml0_4 v-align">
              {submitting
                ? __('Sending transaction...')
                : __('Send transaction')}
            </span>
          </SubmitButton>
        </form>
      </Modal.Footer>
    </Modal>
  );
}

export default reduxForm(formOptions)(PreviewTransactionModal);

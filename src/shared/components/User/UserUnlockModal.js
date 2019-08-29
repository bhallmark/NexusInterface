// External Dependencies
import React, { Component } from 'react';
import styled from '@emotion/styled';

// Internal
import Modal from 'components/Modal';
import Button from 'components/Button';
import Switch from 'components/Switch';
import * as Tritium from 'lib/tritiumApi';
import {
  openConfirmDialog,
  openModal,
  openErrorDialog,
} from 'actions/overlays';

import PinLoginModal from 'components/User/PinLoginModal';

const SmallModal = styled(Modal)(({ theme }) => ({
  width: 'auto',
}));

const Container = styled.div(({ theme }) => ({
  margin: '1em',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const OptionLabel = styled.label(({ theme }) => ({
  color: theme.primary,
  marginTop: '1.75em',
}));

const Option = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const Buttons = styled.div({
  margin: '1em',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export default class UserLock extends Component {
  constructor() {
    super();
    this.state = {
      mintingEnabled: true,
      transactionsEnabled: true,
    };
  }

  componentDidMount() {
    //asdas
  }

  launchPinModal() {
     openModal(PinLoginModal, {
      callback: payload => this.pinCallback(payload),
      params: {
        minting: this.state.mintingEnabled,
        transactions: this.state.transactionsEnabled,
      },
      api: 'users',
      verb: 'unlock',
      noun: 'user',
    });
  }

  pinCallback(payload) {
    this.closeModal();
  }

  switchMinting = e => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);
    this.setState({
      mintingEnabled: !this.state.mintingEnabled,
    });
  };
  switchTransactions = e => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);
    this.setState({
      transactionsEnabled: !this.state.transactionsEnabled,
    });
  };

  render() {
    const { mintingEnabled, transactionsEnabled } = this.state;
    return (
      <SmallModal assignClose={closeModal => (this.closeModal = closeModal)}>
        <Container>
          <h2>{'User Unlock'}</h2>
          <Option>
            <OptionLabel>{'Enable Minting'}</OptionLabel>
            <Switch
              checked={mintingEnabled}
              onChange={this.switchMinting}
              style={{ marginTop: '1.75em' }}
            />
          </Option>
          <Option>
            <OptionLabel>{'Enable Transactions'}</OptionLabel>
            <Switch
              checked={transactionsEnabled}
              onChange={this.switchTransactions}
              style={{ marginTop: '1.75em' }}
            />
          </Option>
          <Buttons>
            <Button
              skin="filled"
              onClick={() => this.closeModal()}
              style={{ margin: '.5em' }}
            >
              {'Cancel'}
            </Button>
            <Button
              skin="filled"
              onClick={() => this.launchPinModal()}
              style={{ margin: '.5em' }}
            >
              {'Lock Wallet'}
            </Button>
          </Buttons>
        </Container>
      </SmallModal>
    );
  }
}
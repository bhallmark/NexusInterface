import { useEffect, useRef } from 'react';
import { atom, useAtomValue, useAtom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import store, { jotaiStore } from 'store';
import { callAPI } from 'lib/api';
import { isLoggedIn } from 'selectors';
import { openModal, isModalOpen } from 'lib/ui';
import * as TYPE from 'consts/actionTypes';
import { updateSettings } from 'lib/settings';
import { bootstrap } from 'lib/bootstrap';
import { refreshUserStatus } from 'lib/session';
import LoginModal from 'components/LoginModal';
import NewUserModal from 'components/NewUserModal';

// TODO: move to right places
export function useCoreInfoPolling() {
  const lastCoreInfoRef = useRef(null);
  useEffect(() => {
    return jotaiStore.sub(coreInfoAtom, async () => {
      const coreInfo = jotaiStore.get(coreInfoAtom);
      const coreConnected = !!coreInfo;
      const state = store.getState();

      if (coreConnected) {
        await refreshUserStatus();

        // The wallet will have to refresh after language is chosen
        // So NewUser modal won't be visible now
        const justConnected = !lastCoreInfoRef.current;
        if (justConnected && state.settings.locale) {
          if (
            !isLoggedIn(state) &&
            !isModalOpen(LoginModal) &&
            !isModalOpen(NewUserModal)
          ) {
            if (state.settings.firstCreateNewUserShown) {
              openModal(LoginModal);
            } else {
              openModal(NewUserModal);
              updateSettings({ firstCreateNewUserShown: true });
            }
          }
        }

        if (
          !state.settings.bootstrapSuggestionDisabled &&
          state.bootstrap.step === 'idle' &&
          !state.settings.manualDaemon &&
          !coreInfo?.litemode &&
          coreInfo?.syncing?.completed < 50 &&
          coreInfo?.syncing?.completed >= 0 &&
          !coreInfo?.private &&
          !coreInfo?.testnet
        ) {
          bootstrap({ suggesting: true });
        }

        if (lastCoreInfoRef.current?.blocks !== coreInfo.blocks) {
          store.dispatch({
            type: TYPE.UPDATE_BLOCK_DATE,
            payload: new Date(),
          });
        }
      }

      lastCoreInfoRef.current = coreInfo;
    });
  }, []);
}

/**
 * New
 * =============================================================================
 */

export const coreInfoPausedAtom = atom(false);

export const coreInfoPollingAtom = atomWithQuery((get) => ({
  queryKey: ['coreInfo'],
  queryFn: () => callAPI('system/get/info'),
  enabled: !get(coreInfoPausedAtom),
  retry: 5,
  retryDelay: (attempt) => 500 + attempt * 1000,
  staleTime: 600000, // 10 minutes
  refetchInterval: 10000, // 10 seconds
  refetchIntervalInBackground: true,
  refetchOnReconnect: 'always',
  placeholderData: (previousData) => previousData,
}));

export const coreInfoAtom = atom((get) => {
  const query = get(coreInfoPollingAtom);
  if (!query || query.isError) {
    return null;
  } else {
    return query.data;
  }
});

const refetchCoreInfoAtom = atom(
  (get) => get(coreInfoPollingAtom)?.refetch || (() => {})
);

export function refetchCoreInfo() {
  jotaiStore.get(refetchCoreInfoAtom)?.();
}

export const coreConnectedAtom = atom((get) => !!get(coreInfoAtom));

export const liteModeAtom = atom((get) => get(coreInfoAtom)?.litemode);

export const synchronizedAtom = atom((get) => !get(coreInfoAtom)?.syncing);

export const useCoreInfo = () => useAtomValue(coreInfoAtom);

export const useCoreConnected = () => useAtomValue(coreConnectedAtom);

export const useSynchronized = () => useAtomValue(synchronizedAtom);

export const isCoreConnected = () => jotaiStore.get(coreConnectedAtom);

export const isSynchronized = () => jotaiStore.get(synchronizedAtom);

// Internal
import UIController from 'components/UIController';
import { clearCoreInfo } from 'actions/coreActionCreators';
import { updateSettings } from 'actions/settingsActionCreators';
import Bootstrapper from './Bootstrapper';
import BootstrapModal from './BootstrapModal';

let running = false;

/**
 * Bootstrap Modal element
 *
 * @export
 * @param {*} [{ suggesting }={}]
 * @returns
 */
export default function bootstrap({ suggesting } = {}) {
  return async (dispatch, getState) => {
    // Only one instance at the same time
    if (running) return;

    running = true;
    const state = getState();
    UIController.openConfirmDialog({
      question: 'Download recent database?',
      note:
        'Downloading a recent version of the database might reduce the time it takes to synchronize your wallet',
      yesLabel: "Yes, let's bootstrap it",
      yesCallback: async () => {
        const bootstrapper = new Bootstrapper();
        try {
          UIController.openModal(BootstrapModal, { bootstrapper });
        } catch (err) {
          running = false;
          throw err;
        }
        const startBootstrapping = async () => {
          try {
            await bootstrapper.start({
              backupFolder: state.settings.backupDirectory,
              clearCoreInfo: () => {
                dispatch(clearCoreInfo());
              },
            });
          } finally {
            running = false;
          }
        };
        // Defer starting bootstrap so that the BootstrapModal can
        // register events in its constructor before the bootstrap starts
        setTimeout(startBootstrapping, 0);
      },
      noLabel: 'No, let it sync',
      noSkin: suggesting ? 'danger' : undefined,
      noCallback: () => {
        running = false;
        if (suggesting) {
          dispatch(
            updateSettings({
              bootstrapSuggestionDisabled: true,
            })
          );
        }
      },
      style: { width: 530 },
    });
  };
}

const checkFreeSpace = Bootstrapper.checkFreeSpace;
const checkBootStrapFreeSpace = Bootstrapper.checkBootStrapFreeSpace;
export { checkFreeSpace, checkBootStrapFreeSpace };

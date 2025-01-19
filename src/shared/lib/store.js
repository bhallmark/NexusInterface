import { useEffect } from 'react';
import { createStore, Provider as JotaiProvider, useAtomValue } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { useHydrateAtoms } from 'jotai/react/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClientAtom } from 'jotai-tanstack-query';
import { rqDevToolsOpenAtom, jotaiDevToolsOpenAtom } from 'lib/ui';
import jotaiDevToolsStyles from 'jotai-devtools/styles.css';

const isDev = process.env.NODE_ENV === 'development';

export const store = createStore();

export function subscribe(atom, listener) {
  return store.sub(atom, () => {
    const value = store.get(atom);
    listener?.(value);
  });
}

export function subscribeWithPrevious(atom, listener) {
  let previousValue = store.get(atom);
  return store.sub(atom, () => {
    const value = store.get(atom);
    listener?.(value, previousValue);
    previousValue = value;
  });
}

export const queryClient = new QueryClient();

function JotaiDevTools() {
  useEffect(() => {
    if (isDev) {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'stylesheet');
      linkEl.setAttribute('type', 'text/css');
      linkEl.setAttribute('href', jotaiDevToolsStyles);
      document.head.appendChild(linkEl);
    }
  }, []);

  const open = useAtomValue(jotaiDevToolsOpenAtom);
  return isDev && open && <DevTools store={store} />;
}

function QueryDevTools() {
  const rqDevToolsOpen = useAtomValue(rqDevToolsOpenAtom);
  return isDev && rqDevToolsOpen && <ReactQueryDevtools />;
}

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <JotaiDevTools />
        <HydrateAtoms>{children}</HydrateAtoms>
        <QueryDevTools />
      </JotaiProvider>
    </QueryClientProvider>
  );
}

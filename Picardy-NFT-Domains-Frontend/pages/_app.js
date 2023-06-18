import '@rainbow-me/rainbowkit/styles.css';
import merge from 'lodash.merge';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/Layout';
import { DomainContext, DomainContextProvider } from '../context/context';
import '../styles/globals.css';

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'picardy',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const myTheme = merge(darkTheme(), {
  colors: {
    accentColor: '#171414',
    actionButtonBorder: '#e4d51c',
    actionButtonSecondaryBackground: '#e4d51c',
  },
  radii: {
    connectButton: '#e4d51c',
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myTheme} coolMode>
        <DomainContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DomainContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

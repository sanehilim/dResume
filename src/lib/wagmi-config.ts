import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: {
    [polygonAmoy.id]: http('https://polygon-amoy.g.alchemy.com/v2/Db6C4RgfEaaDVcHvPllsg'),
  },
  ssr: false,
});
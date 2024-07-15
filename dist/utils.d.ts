import { CHAINS } from '@debank-lux/common';
import { AxiosRequestConfig } from 'axios';
export declare const getChain: (chainId?: string) => import("@debank-lux/common").Chain | null;
export declare const getChainByNetwork: (network?: string | number) => import("@debank-lux/common").Chain | null;
export declare const INITIAL_OPENAPI_URL = "https://api.lux.io";
export declare const INITIAL_TESTNET_OPENAPI_URL = "https://api.testnet.lux.io/";
export { CHAINS };
export declare function genSignParams(config: AxiosRequestConfig): {
    method: any;
    url: string;
    params: Partial<any>;
};
export declare function sleep(ms?: number, signal?: AbortController['signal']): Promise<void>;

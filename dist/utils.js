import { isNil, keyBy, omitBy } from 'lodash';
import { CHAINS } from '@luxwallet/common';
import { decode } from 'qss';
const chainsDict = keyBy(CHAINS, 'serverId');
export const getChain = (chainId) => {
    if (!chainId) {
        return null;
    }
    return chainsDict[chainId];
};
const chainNetworkDict = keyBy(CHAINS, 'network');
export const getChainByNetwork = (network) => {
    if (!network) {
        return null;
    }
    network = network.toString();
    return chainNetworkDict[network.startsWith('0x') ? +network : network];
};
export const INITIAL_OPENAPI_URL = 'https://api.rabby.io';
export const INITIAL_TESTNET_OPENAPI_URL = 'https://api.testnet.rabby.io/';
export { CHAINS };
export function genSignParams(config) {
    var _a, _b, _c;
    let params = omitBy((_a = config.params) !== null && _a !== void 0 ? _a : {}, isNil);
    const method = ((_b = config.method) !== null && _b !== void 0 ? _b : 'GET').toUpperCase();
    let url = decodeURIComponent((_c = config.url) !== null && _c !== void 0 ? _c : '');
    if (url.search(/\?/) > 0) {
        const [_url, qs] = url.split('?');
        const query = decode(qs);
        params = Object.assign(Object.assign({}, params), query);
        url = _url;
    }
    return {
        method,
        url,
        params,
    };
}
export function sleep(ms = 0, signal) {
    if ((signal === null || signal === void 0 ? void 0 : signal.aborted) || ms < 0) {
        return Promise.reject(new DOMException('Aborted', 'AbortError'));
    }
    return new Promise((resolve, reject) => {
        const abortHandler = () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
            signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abortHandler);
        };
        signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', abortHandler);
        const timer = setTimeout(() => {
            resolve();
            signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abortHandler);
        }, ms);
    });
}

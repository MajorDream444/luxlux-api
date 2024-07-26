var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sign from '@luxwallet/lux-sign/umd/sign-wasm-lux';
import { SIGN_HDS } from '../const';
function getWebHf() {
    var _a, _b, _c, _d;
    const hf = 
    // @ts-expect-error
    typeof chrome === 'undefined'
        ? ''
        : // @ts-expect-error
            ((_b = (_a = chrome === null || chrome === void 0 ? void 0 : chrome.runtime) === null || _a === void 0 ? void 0 : _a.getURL) === null || _b === void 0 ? void 0 : _b.call(_a, 'bridge.html')) ||
                (
                // @ts-expect-error
                (_d = (_c = chrome === null || chrome === void 0 ? void 0 : chrome.extension) === null || _c === void 0 ? void 0 : _c.getURL) === null || _d === void 0 ? void 0 : _d.call(_c, 'bridge.html')) ||
                '';
    return hf;
}
export const WebSignApiPlugin = {
    onInitiateAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield sign.lW((options === null || options === void 0 ? void 0 : options.webHf) || getWebHf());
        });
    },
    onSignRequest(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parsed, axiosRequestConfig: config } = ctx;
            const { method, url, params } = parsed;
            const res = sign.cattleGsW(params, method, url);
            config.headers = config.headers || {};
            config.headers[SIGN_HDS[0]] = encodeURIComponent(res.ts);
            config.headers[SIGN_HDS[1]] = encodeURIComponent(res.nonce);
            config.headers[SIGN_HDS[2]] = encodeURIComponent(res.version);
            config.headers[SIGN_HDS[3]] = encodeURIComponent(res.signature);
        });
    },
};

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _OpenApiService_adapter, _OpenApiService_plugin, _OpenApiService_clientName, _OpenApiService_clientVersion;
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { ethErrors } from 'eth-rpc-errors';
import { genSignParams, sleep } from './utils';
import { omit } from 'lodash';
import { ASYNC_JOB_RETRY_DELAY, ASYNC_JOB_TIMEOUT } from './const';
const maxRPS = 500;
export class OpenApiService {
    constructor(_a) {
        var _b;
        var { store, plugin, adapter, clientName = 'lux', clientVersion = (_b = process.env.release) !== null && _b !== void 0 ? _b : '0.0.0', } = _a;
        _OpenApiService_adapter.set(this, void 0);
        _OpenApiService_plugin.set(this, void 0);
        _OpenApiService_clientName.set(this, void 0);
        _OpenApiService_clientVersion.set(this, void 0);
        this.setHost = (host) => __awaiter(this, void 0, void 0, function* () {
            this.store.host = host;
            yield this.init();
        });
        this.setHostSync = (host) => {
            this.store.host = host;
            this.initSync();
        };
        this.getHost = () => {
            return this.store.host;
        };
        this.setTestnetHost = (host) => __awaiter(this, void 0, void 0, function* () {
            this.store.testnetHost = host;
        });
        this.getTestnetHost = () => {
            return this.store.testnetHost;
        };
        this.ethRpc = () => __awaiter(this, void 0, void 0, function* () {
            throw ethErrors.provider.disconnected();
        });
        this.init = (options) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            options = typeof options === 'string' ? { webHf: options } : options;
            yield ((_d = (_c = __classPrivateFieldGet(this, _OpenApiService_plugin, "f")).onInitiateAsync) === null || _d === void 0 ? void 0 : _d.call(_c, Object.assign({}, options)));
            this.initSync(Object.assign({}, options));
        });
        this.asyncJob = (url, options) => {
            const _option = Object.assign({ timeout: ASYNC_JOB_TIMEOUT, retryDelay: ASYNC_JOB_RETRY_DELAY }, options);
            const startTime = +new Date();
            return this.request(url, omit(Object.assign({ method: 'GET' }, _option), 'retryDelay')).then((res) => {
                const data = res.data;
                if (data.result) {
                    return data.result.data;
                }
                const deltaTime = +new Date() - startTime;
                _option.timeout = _option.timeout - deltaTime - _option.retryDelay;
                return sleep(_option.retryDelay, _option.signal).then(() => this.asyncJob(url, _option));
            });
        };
        this._mountMethods = () => {
            this.ethRpc = (chain_id, { origin = 'lux', method, params }) => {
                return this.request
                    .post(`/v1/wallet/eth_rpc?origin=${origin}&method=${method}`, {
                    chain_id,
                    method,
                    params,
                })
                    .then(({ data }) => {
                    if (data === null || data === void 0 ? void 0 : data.error) {
                        throw data.error;
                    }
                    return data === null || data === void 0 ? void 0 : data.result;
                });
            };
        };
        this.getRecommendChains = (address, origin) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/recommend_chains', {
                params: {
                    user_addr: address,
                    origin,
                },
            });
            return data;
        });
        this.getTotalBalance = (address) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/total_balance', {
                params: {
                    id: address,
                },
            });
            return data;
        });
        this.getPendingCount = (address) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/pending_tx_count', {
                params: {
                    user_addr: address,
                },
            });
            return data;
        });
        this.checkOrigin = (address, origin) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/check_origin', {
                user_addr: address,
                origin,
            });
            return data;
        });
        this.checkText = (address, origin, text) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/check_text', {
                user_addr: address,
                origin,
                text,
            });
            return data;
        });
        this.checkTx = (tx, origin, address, update_nonce = false) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/check_tx', {
                user_addr: address,
                origin,
                tx,
                update_nonce,
            });
            return data;
        });
        this.preExecTx = ({ tx, origin, address, updateNonce = false, pending_tx_list = [], }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/pre_exec_tx', {
                tx,
                user_addr: address,
                origin,
                update_nonce: updateNonce,
                pending_tx_list,
            });
            return data;
        });
        this.historyGasUsed = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/history_tx_used_gas', Object.assign({}, params));
            return data;
        });
        this.pendingTxList = (tx, origin, address, update_nonce = false) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/pending_tx_list', {
                tx,
                user_addr: address,
                origin,
                update_nonce,
            });
            return data;
        });
        this.traceTx = (txId, traceId, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/trace_tx', {
                tx_id: txId,
                trace_id: traceId,
                chain_id: chainId,
            });
            return data;
        });
        this.pushTx = (tx, traceId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/push_tx', {
                tx,
                trace_id: traceId,
            });
            return data;
        });
        this.explainText = (origin, address, text) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/explain_text', {
                user_addr: address,
                origin,
                text,
            });
            return data;
        });
        this.gasMarket = (chainId, customGas) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/gas_market', {
                params: {
                    chain_id: chainId,
                    custom_price: customGas,
                },
            });
            return data;
        });
        this.getTx = (chainId, hash, gasPrice) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/get_tx', {
                params: {
                    chain_id: chainId,
                    gas_price: gasPrice,
                    tx_id: hash,
                },
            });
            return data;
        });
        this.getEnsAddressByName = (name) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/ens', {
                params: {
                    text: name,
                },
            });
            return data;
        });
        this.searchToken = (id, q, chainId, is_all = false) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/token_search', {
                params: {
                    id,
                    q,
                    has_balance: false,
                    is_all,
                    chain_id: chainId,
                },
            });
            return data;
        });
        this.searchSwapToken = (id, chainId, q, is_all = false) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/token_search', {
                params: {
                    id,
                    chain_id: chainId,
                    q,
                    is_all,
                },
            });
            return data;
        });
        this.getToken = (id, chainId, tokenId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/token', {
                params: {
                    id,
                    chain_id: chainId,
                    token_id: tokenId,
                },
            });
            return data;
        });
        this.getCachedTokenList = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/cache_token_list', {
                params: {
                    id,
                },
            });
            return data;
        });
        this.listToken = (id, chainId, isAll = false) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/token_list', {
                params: {
                    id,
                    is_all: isAll,
                    chain_id: chainId,
                },
            });
            return data;
        });
        this.getHistoryTokenList = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/history_token_list', {
                params: {
                    id: params.id,
                    chain_id: params.chainId,
                    time_at: params.timeAt,
                    date_at: params.dateAt,
                },
            });
            return data;
        });
        this.customListToken = (uuids, id) => __awaiter(this, void 0, void 0, function* () {
            if (!(uuids === null || uuids === void 0 ? void 0 : uuids.length) || !id) {
                return [];
            }
            const { data } = yield this.request.post('/v1/user/specific_token_list', {
                id,
                uuids,
            });
            return data;
        });
        this.listChainAssets = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/simple_protocol_list', {
                params: {
                    id,
                },
            });
            return data;
        });
        this.listNFT = (id, isAll = true) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/nft_list', {
                params: {
                    id,
                    is_all: isAll,
                },
            });
            return data;
        });
        this.listCollection = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/nft/collections', {
                params,
            });
            return data;
        });
        this.listTxHisotry = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/history_list', {
                params,
            });
            return data;
        });
        this.getAllTxHistory = (params, options) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.asyncJob('/v1/user/history_all_list', Object.assign({ method: 'GET', params }, options));
            return data;
        });
        this.tokenPrice = (tokenName) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/token/price_change', {
                params: {
                    token: tokenName,
                },
            });
            return data;
        });
        this.tokenAuthorizedList = (id, chain_id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/token_authorized_list', {
                params: {
                    id,
                    chain_id,
                },
            });
            return data;
        });
        this.userNFTAuthorizedList = (id, chain_id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/nft_authorized_list', {
                params: {
                    id,
                    chain_id,
                },
            });
            return data;
        });
        this.getDEXList = (chain_id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/swap_dex_list', {
                params: {
                    chain_id,
                },
            });
            return data;
        });
        this.getSwapQuote = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/swap_quote', {
                params,
            });
            return data;
        });
        this.getSwapTokenList = (id, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/swap_token_list', {
                params: {
                    id,
                    chain_id: chainId,
                    is_all: false,
                },
            });
            return data;
        });
        this.postGasStationOrder = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/gas_station_order', {
                order: {
                    user_addr: params.userAddr,
                    from_chain_id: params.fromChainId,
                    from_tx_id: params.fromTxId,
                    from_token_id: params.fromTokenId,
                    from_token_amount: params.fromTokenAmount,
                    to_chain_id: params.toChainId,
                    to_token_amount: params.toTokenAmount,
                    from_usd_value: params.fromUsdValue,
                },
            });
            return data;
        });
        this.getGasStationChainBalance = (chain_id, addr) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/gas_station_usd_value', {
                params: {
                    chain_id,
                    addr,
                },
            });
            return data;
        });
        this.getGasStationTokenList = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/gas_station_token_list');
            return data;
        });
        this.explainTypedData = (user_addr, origin, data) => __awaiter(this, void 0, void 0, function* () {
            const { data: resData } = yield this.request.post('/v1/wallet/explain_typed_data', {
                user_addr,
                origin,
                data,
            });
            return resData;
        });
        this.checkTypedData = (user_addr, origin, data) => __awaiter(this, void 0, void 0, function* () {
            const { data: resData } = yield this.request.post('/v1/wallet/check_typed_data', {
                user_addr,
                origin,
                data,
            });
            return resData;
        });
        this.approvalStatus = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/approval_status', {
                params: {
                    id,
                },
            });
            return data;
        });
        this.usedChainList = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/used_chain_list', {
                params: {
                    id,
                },
            });
            return data;
        });
        this.getLatestVersion = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/version');
            return data;
        });
        this.addOriginFeedback = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/add_origin_feedback', {
                user_addr: params.user_addr,
                origin: params.origin,
                is_safe: params.is_safe,
            });
            return data;
        });
        this.getProtocolList = (addr) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/protocol_list', {
                params: {
                    id: addr,
                },
            });
            return data;
        });
        this.getComplexProtocolList = (addr) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/complex_protocol_list', {
                params: {
                    id: addr,
                },
            });
            return data;
        });
        this.getProtocol = ({ addr, id, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/protocol', {
                params: {
                    id: addr,
                    protocol_id: id,
                },
            });
            return data;
        });
        this.getHistoryProtocol = ({ addr, id, timeAt, dateAt, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/history_protocol', {
                params: {
                    id: addr,
                    protocol_id: id,
                    time_at: timeAt,
                    date_at: dateAt,
                },
            });
            return data;
        });
        this.getTokenHistoryPrice = ({ chainId, id, timeAt, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/token/history_price', {
                params: {
                    chain_id: chainId,
                    id,
                    time_at: timeAt,
                },
            });
            return data;
        });
        this.getTokenHistoryDict = ({ chainId, ids, timeAt, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/token/history_price_dict', {
                params: {
                    chain_id: chainId,
                    ids,
                    time_at: timeAt,
                },
            });
            return data;
        });
        this.getNetCurve = (addr) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/total_net_curve', {
                params: {
                    id: addr,
                },
            });
            return data;
        });
        this.getChainList = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/chain/list');
            return data;
        });
        this.getCEXSwapQuote = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/cex_swap_quote', {
                params,
            });
            return data;
        });
        this.getSwapTradeList = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/swap_trade_list', {
                params,
            });
            return data;
        });
        this.postSwap = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/swap_trade', params);
            return data;
        });
        this.checkSlippage = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/check_slippage', {
                params,
            });
            return data;
        });
        this.getOriginPopularityLevel = (origin) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/origin/popularity_level', {
                params: {
                    origin,
                },
            });
            return data;
        });
        this.getOriginIsScam = (origin, source) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/origin/is_scam', {
                params: {
                    origin,
                    source,
                },
            });
            return data;
        });
        this.getOriginThirdPartyCollectList = (origin) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/origin/third_party_collect_list', {
                params: {
                    origin,
                },
            });
            return data;
        });
        this.getSummarizedAssetList = (id, chain_id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/summarized_asset_list', {
                params: {
                    id,
                    chain_id,
                },
            });
            return data;
        });
        this.unexpectedAddrList = ({ chainId, tx, origin, addr, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/engine/addr/unexpected_list', {
                chain_id: chainId,
                tx,
                origin,
                user_addr: addr,
            });
            return data;
        });
        this.gasLessTxCheck = ({ tx, usdValue, preExecSuccess, gasUsed, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/tx_is_gasless', {
                gas_used: gasUsed,
                pre_exec_success: preExecSuccess,
                tx,
                usd_value: usdValue,
            });
            return data;
        });
        this.parseTx = ({ chainId, tx, origin, addr, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/engine/action/parse_tx', {
                chain_id: chainId,
                tx,
                origin,
                user_addr: addr,
            });
            return data;
        });
        this.isSuspiciousToken = (id, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/token/is_suspicious', {
                params: {
                    chain_id: chainId,
                    id,
                },
            });
            return data;
        });
        this.depositCexSupport = (id, chainId, cexId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/token/deposit_cex_support', {
                params: {
                    chain_id: chainId,
                    id,
                    cex_id: cexId,
                },
            });
            return data;
        });
        // Token 可充值的 CEX 列表
        this.depositCexList = (id, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/token/deposit_cex_list', {
                params: {
                    chain_id: chainId,
                    id,
                },
            });
            return data;
        });
        // 合约信用分
        this.getContractCredit = (id, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/contract/credit', {
                params: {
                    chain_id: chainId,
                    id,
                },
            });
            return data;
        });
        // 是否跟地址交互过
        this.hasInteraction = (addr, chainId, contractId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/contract/has_interaction', {
                params: {
                    chain_id: chainId,
                    user_addr: addr,
                    contract_id: contractId,
                },
            });
            return data;
        });
        // 授权风险敞口
        this.tokenApproveExposure = (id, chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/contract/token_approval_exposure', {
                params: {
                    chain_id: chainId,
                    id,
                },
            });
            return data;
        });
        // 地址描述
        this.addrDesc = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/addr/desc', {
                params: {
                    id,
                },
            });
            return data;
        });
        // 两个地址是否发生过转账
        this.hasTransfer = (chainId, from, to) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/addr/has_transfer', {
                params: {
                    chain_id: chainId,
                    from_addr: from,
                    to_addr: to,
                },
            });
            return data;
        });
        this.isTokenContract = (chainId, id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/contract/is_token', {
                params: {
                    id,
                    chain_id: chainId,
                },
            });
            return data;
        });
        this.addrUsedChainList = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/addr/used_chain_list', {
                params: { id },
            });
            return data;
        });
        this.getTokenNFTExposure = (chainId, id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/contract/top_nft_approval_exposure', {
                params: { chain_id: chainId, id },
            });
            return data;
        });
        this.getCollection = (chainId, id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/collection', {
                params: { chain_id: chainId, id },
            });
            return data;
        });
        this.isSuspiciousCollection = (chainId, id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/collection/is_suspicious', {
                params: { chain_id: chainId, id },
            });
            return data;
        });
        this.isOriginVerified = (origin) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/origin/is_verified', {
                params: { origin },
            });
            return data;
        });
        this.parseTypedData = ({ typedData, origin, address, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/engine/action/parse_typed_data', {
                typed_data: typedData,
                origin,
                user_addr: address,
            });
            return data;
        });
        this.parseText = ({ text, origin, address, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/engine/action/parse_text', {
                text,
                origin,
                user_addr: address,
            });
            return data;
        });
        this.collectionList = ({ id, chainId, isAll, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/collection_list', {
                params: {
                    id,
                    chain_id: chainId,
                    is_all: isAll,
                },
            });
            return data;
        });
        this.gasPriceStats = (chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/gas_price_stats', {
                params: {
                    chain_id: chainId,
                },
            });
            return data;
        });
        this.badgeHasClaimed = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/badge/code/user_has_claimed', {
                params: {
                    user_id: id,
                },
            });
            return data;
        });
        this.badgeHasMinted = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/badge/user_has_minted', {
                params: {
                    user_id: id,
                },
            });
            return data;
        });
        this.mintBadge = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/badge/mint', {
                code: params.code,
                user_id: params.userAddr,
            });
            return data;
        });
        this.badgeHasClaimedByName = ({ id, name, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get(`/v1/badge/code/user_has_claimed/${name}`, {
                params: {
                    user_id: id,
                },
            });
            return data;
        });
        this.badgeHasMintedByName = ({ id, name, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get(`/v1/badge/user_has_minted/${name}`, {
                params: {
                    user_id: id,
                },
            });
            return data;
        });
        this.mintBadgeByName = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post(`/v1/badge/mint/${params.name}`, {
                code: params.code,
                user_id: params.userAddr,
            });
            return data;
        });
        this.userHasRequestedFaucet = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/faucet/user_has_requested', {
                params,
            });
            return data;
        });
        this.requestFaucet = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/faucet/request', Object.assign({}, params));
            return data;
        });
        this.gasSupportedPushType = (chainId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/supported_push_type', {
                params: {
                    chain_id: chainId,
                },
            });
            return data;
        });
        this.submitTx = (postData) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/submit_tx', Object.assign({}, postData));
            return data;
        });
        this.getTxRequests = (ids) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/get_tx_requests', {
                params: {
                    ids: Array.isArray(ids) ? ids.join(',') : ids,
                },
            });
            return data;
        });
        this.getTxRequest = (id) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/get_tx_request', {
                params: {
                    id,
                },
            });
            return data;
        });
        this.withdrawTx = (reqId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/withdraw_tx', {
                id: reqId,
            });
            return data;
        });
        this.retryPushTx = (reqId) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/retry_push_tx', {
                id: reqId,
            });
            return data;
        });
        this.mempoolChecks = (txId, chainId, node_info) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/mempool_checks', {
                params: {
                    tx_id: txId,
                    chain_id: chainId,
                    node_info: node_info ? 1 : 0,
                },
            });
            return data;
        });
        this.getPendingTxList = (params, options) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.asyncJob('/v1/wallet/get_pending_tx_list', Object.assign({ params }, options));
            return data;
        });
        this.getLatestPreExec = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/get_latest_pre_exec', {
                params,
            });
            return data;
        });
        this.walletSupportChain = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/support_chain', params);
            return data;
        });
        this.walletSupportOrigin = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/support_origin', params);
            return data;
        });
        this.walletSupportSelector = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/wallet/support_selector', params);
            return data;
        });
        this.searchDapp = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/dapp/search', { params });
            return data;
        });
        this.getDappsInfo = (params) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const { data } = yield this.request.get('/v1/dapp/list', {
                params: {
                    ids: (_e = params === null || params === void 0 ? void 0 : params.ids) === null || _e === void 0 ? void 0 : _e.join(','),
                },
            });
            return data;
        });
        this.getDappHotTags = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/dapp/hot_tags', {
                params,
            });
            return data;
        });
        this.getHotDapps = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/dapp/hot_list', { params });
            return data;
        });
        this.getluxClaimText = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/user/claim_text', {
                params,
            });
            return data;
        });
        this.getluxSignatureText = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/user/sign_text', {
                params,
            });
            return data;
        });
        this.getluxPoints = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/user', { params });
            return data;
        });
        this.checkluxPointsInviteCode = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/user/invite_code_exist', { params });
            return data;
        });
        this.setluxPointsInviteCode = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/points/user/invite_code', params);
            return data;
        });
        this.checkluxPointClaimable = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/user/claimable', {
                params,
            });
            return data;
        });
        this.getluxPointsSnapshot = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/snapshot', { params });
            return data;
        });
        this.claimluxPointsSnapshot = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/points/claim_snapshot', params);
            return data;
        });
        this.getluxPointsTopUsers = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/top_user', { params });
            return data;
        });
        this.getluxPointsList = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/points/campaign_list', {
                params,
            });
            return data;
        });
        this.getluxPointsCampaignIsEnded = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('v1/points/campaign');
            return data;
        });
        this.claimluxPointsById = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/points/claim_campaign', params);
            return data;
        });
        this.getluxPointsV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user', { params });
            return data;
        });
        this.getluxSignatureTextV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user/sign_text', {
                params,
            });
            return data;
        });
        this.getluxClaimTextV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user/claim_text', {
                params,
            });
            return data;
        });
        this.setluxPointsInviteCodeV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v2/points/user/invite_code', params);
            return data;
        });
        this.checkluxPointsInviteCodeV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user/invite_code_exist', {
                params,
            });
            return data;
        });
        this.claimluxPointsSnapshotV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v2/points/claim_snapshot', params);
            return data;
        });
        this.getluxPointsTopUsersV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/top_user', {
                params,
            });
            return data;
        });
        this.getluxPointsListV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/campaign_list', {
                params,
            });
            return data;
        });
        this.claimluxPointsByIdV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v2/points/claim_campaign', params);
            return data;
        });
        this.getluxPointsSnapshotV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/snapshot', {
                params,
            });
            return data;
        });
        this.checkluxPointClaimableV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user/claimable', {
                params,
            });
            return data;
        });
        this.checkClaimInfoV2 = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v2/points/user/claim_info', {
                params,
            });
            return data;
        });
        this.getluxPointsCampaignIsEndedV2 = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('v2/points/campaign');
            return data;
        });
        this.getSupportedChains = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/wallet/supported_chains');
            return data;
        });
        this.searchChainList = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/chain/total_list', {
                params,
            });
            return data;
        });
        this.getChainListByIds = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/chain/get_list', {
                params,
            });
            return data;
        });
        this.getHistoryCurve = (addr) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/history_curve', {
                params: { id: addr },
            });
            return data;
        });
        this.getHistoryCurveSupportedList = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/chain/classify_supported_list');
            return data;
        });
        this.getHistoryCurveStatus = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/history_curve/status', {
                params,
            });
            return data;
        });
        this.initHistoryCurve = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/user/history_curve/init', params);
            return data;
        });
        this.getNodeStatusList = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/node/list');
            return data;
        });
        this.getNodeStatusDetail = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/node', { params });
            return data;
        });
        this.postActionLog = (body) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.post('/v1/engine/action/log', body);
            return data;
        });
        this.checkSpoofing = ({ from, to, }) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/engine/addr/is_spoofing', {
                params: { user_addr: from, dest_addr: to },
            });
            return data;
        });
        this.getAddressByDeBankId = (name) => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.request.get('/v1/user/web3_id', {
                params: {
                    text: name,
                },
            });
            return data;
        });
        if (store instanceof Promise) {
            store.then((resolvedStore) => {
                this.store = resolvedStore;
            });
        }
        else {
            this.store = store;
        }
        __classPrivateFieldSet(this, _OpenApiService_plugin, plugin, "f");
        __classPrivateFieldSet(this, _OpenApiService_adapter, adapter, "f");
        __classPrivateFieldSet(this, _OpenApiService_clientName, clientName, "f");
        __classPrivateFieldSet(this, _OpenApiService_clientVersion, clientVersion, "f");
    }
    initSync(options) {
        var _a, _b;
        (_b = (_a = __classPrivateFieldGet(this, _OpenApiService_plugin, "f")).onInitiate) === null || _b === void 0 ? void 0 : _b.call(_a, Object.assign({}, options));
        const request = axios.create({
            baseURL: this.store.host,
            adapter: __classPrivateFieldGet(this, _OpenApiService_adapter, "f"),
            headers: {
                'X-Client': __classPrivateFieldGet(this, _OpenApiService_clientName, "f"),
                'X-Version': __classPrivateFieldGet(this, _OpenApiService_clientVersion, "f"),
            },
        });
        // sign after rateLimit, timestamp is the latest
        request.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            const { method, url, params } = genSignParams(config);
            yield __classPrivateFieldGet(this, _OpenApiService_plugin, "f").onSignRequest({
                axiosRequestConfig: config,
                parsed: { method, url, params },
            });
            return config;
        }));
        this.request = rateLimit(request, { maxRPS });
        this.request.interceptors.response.use((response) => {
            var _a, _b, _c, _d;
            const code = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.err_code) || ((_b = response.data) === null || _b === void 0 ? void 0 : _b.error_code);
            const msg = ((_c = response.data) === null || _c === void 0 ? void 0 : _c.err_msg) || ((_d = response.data) === null || _d === void 0 ? void 0 : _d.error_msg);
            if (code && code !== 200) {
                if (msg) {
                    let err;
                    try {
                        err = new Error(JSON.parse(msg));
                    }
                    catch (e) {
                        err = new Error(msg);
                    }
                    throw err;
                }
                throw new Error(typeof response.data === 'string'
                    ? response.data
                    : JSON.stringify(response.data));
            }
            return response;
        });
        this._mountMethods();
    }
}
_OpenApiService_adapter = new WeakMap(), _OpenApiService_plugin = new WeakMap(), _OpenApiService_clientName = new WeakMap(), _OpenApiService_clientVersion = new WeakMap();

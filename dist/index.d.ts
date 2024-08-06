import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { RateLimitedAxiosInstance } from 'axios-rate-limit';
import { InitOptions, luxApiPlugin } from './plugins/intf';
import { AddrDescResponse, BridgeAggregator, ApprovalStatus, AssetItem, BasicDappInfo, CEXQuote, Cex, ChainListItem, ChainWithPendingCount, Collection, CollectionList, CollectionWithFloorPrice, ComplexProtocol, ContractCredit, DbkBridgeHistoryItem, ExplainTxResponse, ExplainTypedDataResponse, GasLevel, GetTxResponse, HistoryCurve, LatestExplainTxResponse, MempoolCheckDetail, NFTApprovalResponse, NFTItem, NodeStatus, NodeStatusDetail, ParseTextResponse, ParseTxResponse, ParseTypedDataResponse, PendingTxItem, Protocol, SecurityCheckResponse, ServerChain, SlippageStatus, Summary, SupportedChain, SwapTradeList, TokenApproval, TokenItem, TotalBalanceResponse, Tx, TxAllHistoryResult, TxHistoryResult, TxPushType, TxRequest, UsedChain, BridgeTokenPair, BridgeQuote, BridgeHistory } from './types';
interface OpenApiStore {
    host: string;
    testnetHost?: string;
}
interface Options {
    store: OpenApiStore | Promise<OpenApiStore>;
    plugin: luxApiPlugin;
    adapter?: AxiosAdapter;
    clientName?: string;
    clientVersion?: string;
}
export declare class OpenApiService {
    #private;
    store: OpenApiStore;
    request: RateLimitedAxiosInstance;
    constructor({ store, plugin, adapter, clientName, clientVersion, }: Options);
    setHost: (host: string) => Promise<void>;
    setHostSync: (host: string) => void;
    getHost: () => string;
    setTestnetHost: (host: string) => Promise<void>;
    getTestnetHost: () => string | undefined;
    ethRpc: ((chainId: string, arg: {
        method: string;
        params: Array<any>;
        origin?: string;
    }) => Promise<any>) | (() => Promise<never>);
    init: (options?: string | InitOptions) => Promise<void>;
    initSync(options?: InitOptions): void;
    asyncJob: <T = any>(url: string, options?: AxiosRequestConfig & {
        retryDelay?: number;
    }) => Promise<T>;
    private _mountMethods;
    getRecommendChains: (address: string, origin: string) => Promise<ServerChain[]>;
    getTotalBalance: (address: string) => Promise<TotalBalanceResponse>;
    getPendingCount: (address: string) => Promise<{
        total_count: number;
        chains: ChainWithPendingCount[];
    }>;
    checkOrigin: (address: string, origin: string) => Promise<SecurityCheckResponse>;
    checkText: (address: string, origin: string, text: string) => Promise<SecurityCheckResponse>;
    checkTx: (tx: Tx, origin: string, address: string, update_nonce?: boolean) => Promise<SecurityCheckResponse>;
    preExecTx: ({ tx, origin, address, updateNonce, pending_tx_list, }: {
        tx: Tx;
        origin: string;
        address: string;
        updateNonce: boolean;
        pending_tx_list: Tx[];
    }) => Promise<ExplainTxResponse>;
    historyGasUsed: (params: {
        tx: Tx;
        user_addr: string;
    }) => Promise<{
        gas_used: number;
    }>;
    pendingTxList: (tx: Tx, origin: string, address: string, update_nonce?: boolean) => Promise<Tx[]>;
    traceTx: (txId: string, traceId: string, chainId: string) => Promise<void>;
    pushTx: (tx: Tx, traceId?: string) => Promise<any>;
    explainText: (origin: string, address: string, text: string) => Promise<{
        comment: string;
    }>;
    gasMarket: (chainId: string, customGas?: number) => Promise<GasLevel[]>;
    getTx: (chainId: string, hash: string, gasPrice: number) => Promise<GetTxResponse>;
    getEnsAddressByName: (name: string) => Promise<{
        addr: string;
        name: string;
    }>;
    searchToken: (id: string, q: string, chainId?: string, is_all?: boolean) => Promise<TokenItem[]>;
    searchSwapToken: (id: string, chainId: string, q: string, is_all?: boolean) => Promise<any>;
    getToken: (id: string, chainId: string, tokenId: string) => Promise<TokenItem>;
    getCachedTokenList: (id: string) => Promise<TokenItem[]>;
    listToken: (id: string, chainId?: string, isAll?: boolean) => Promise<TokenItem[]>;
    getHistoryTokenList: (params: {
        id: string;
        chainId?: string;
        timeAt?: number;
        dateAt?: string;
    }) => Promise<TokenItem[]>;
    customListToken: (uuids: string[], id: string) => Promise<TokenItem[]>;
    listChainAssets: (id: string) => Promise<AssetItem[]>;
    listNFT: (id: string, isAll?: boolean) => Promise<NFTItem[]>;
    listCollection: (params: {
        collection_ids: string;
    }) => Promise<Collection[]>;
    listTxHisotry: (params: {
        id?: string;
        chain_id?: string;
        token_id?: string;
        coin_id?: string;
        start_time?: number;
        page_count?: number;
    }) => Promise<TxHistoryResult>;
    getAllTxHistory: (params: {
        id: string;
        start_time?: number;
    }, options?: Parameters<typeof this.asyncJob>[1]) => Promise<TxAllHistoryResult>;
    tokenPrice: (tokenName: string) => Promise<{
        change_percent: number;
        last_price: number;
    }>;
    tokenAuthorizedList: (id: string, chain_id: string) => Promise<TokenApproval[]>;
    userNFTAuthorizedList: (id: string, chain_id: string) => Promise<NFTApprovalResponse>;
    getDEXList: (chain_id: string) => Promise<{
        id: string;
        name: string;
        logo_url: string;
        site_url: string;
        type: string;
    }[]>;
    getSwapQuote: (params: {
        id: string;
        chain_id: string;
        dex_id: string;
        pay_token_id: string;
        pay_token_raw_amount: string;
        receive_token_id: string;
        slippage?: string | number;
        fee?: boolean;
    }) => Promise<{
        receive_token_raw_amount: number;
        dex_approve_to: string;
        dex_swap_to: string;
        dex_swap_calldata: string;
        is_wrapped: boolean;
        gas: {
            gas_used: number;
            gas_price: number;
            gas_cost_value: number;
            gas_cost_usd_value: number;
        };
        pay_token: TokenItem;
        receive_token: TokenItem;
    }>;
    getSwapTokenList: (id: string, chainId?: string) => Promise<TokenItem[]>;
    postGasStationOrder: (params: {
        userAddr: string;
        fromChainId: string;
        fromTxId: string;
        toChainId: string;
        toTokenAmount: string;
        fromTokenId: string;
        fromTokenAmount: string;
        fromUsdValue: number;
    }) => Promise<any>;
    getGasStationChainBalance: (chain_id: string, addr: string) => Promise<{
        usd_value: number;
    }>;
    getGasStationTokenList: () => Promise<TokenItem[]>;
    explainTypedData: (user_addr: string, origin: string, data: any) => Promise<ExplainTypedDataResponse>;
    checkTypedData: (user_addr: string, origin: string, data: any) => Promise<SecurityCheckResponse>;
    approvalStatus: (id: string) => Promise<ApprovalStatus[]>;
    usedChainList: (id: string) => Promise<UsedChain[]>;
    getLatestVersion: () => Promise<{
        version_tag: string;
    }>;
    addOriginFeedback: (params: {
        user_addr: string;
        origin: string;
        is_safe: boolean;
    }) => Promise<{
        is_success: boolean;
    }>;
    getProtocolList: (addr: string) => Promise<Protocol[]>;
    getComplexProtocolList: (addr: string) => Promise<ComplexProtocol[]>;
    getProtocol: ({ addr, id, }: {
        addr: string;
        id: string;
    }) => Promise<ComplexProtocol>;
    getHistoryProtocol: ({ addr, id, timeAt, dateAt, }: {
        addr: string;
        id: string;
        timeAt?: number | undefined;
        dateAt?: number | undefined;
    }) => Promise<ComplexProtocol>;
    getTokenHistoryPrice: ({ chainId, id, timeAt, }: {
        chainId: string;
        id: string;
        timeAt: number;
    }) => Promise<{
        price: number;
    }>;
    getTokenHistoryDict: ({ chainId, ids, timeAt, }: {
        chainId: string;
        ids: string;
        timeAt: number;
    }) => Promise<Record<string, number>>;
    getNetCurve: (addr: string) => Promise<{
        timestamp: number;
        usd_value: number;
    }[]>;
    getChainList: () => Promise<ServerChain[]>;
    getCEXSwapQuote: (params: {
        cex_id: string;
        pay_token_id: string;
        pay_token_amount: string;
        receive_token_id: string;
        chain_id: string;
    }) => Promise<CEXQuote>;
    getSwapTradeList: (params: {
        user_addr: string;
        start: string;
        limit: string;
    }) => Promise<SwapTradeList>;
    postSwap: (params: {
        quote: {
            pay_token_id: string;
            pay_token_amount: number;
            receive_token_id: string;
            receive_token_amount: number;
            slippage: number;
        };
        dex_id: string;
        tx_id: string;
        tx: Tx;
    }) => Promise<any>;
    checkSlippage: (params: {
        chain_id: string;
        slippage: string;
        from_token_id: string;
        to_token_id: string;
    }) => Promise<SlippageStatus>;
    getOriginPopularityLevel: (origin: string) => Promise<{
        level: 'very_low' | 'low' | 'medium' | 'high';
    }>;
    getOriginIsScam: (origin: string, source: string) => Promise<{
        is_scam: boolean;
    }>;
    getOriginThirdPartyCollectList: (origin: string) => Promise<{
        collect_list: {
            name: string;
            logo_url: string;
        }[];
    }>;
    getSummarizedAssetList: (id: string, chain_id?: string) => Promise<Summary>;
    unexpectedAddrList: ({ chainId, tx, origin, addr, }: {
        chainId: string;
        tx: Tx;
        origin: string;
        addr: string;
    }) => Promise<{
        id: string;
    }[]>;
    gasLessTxCheck: ({ tx, usdValue, preExecSuccess, gasUsed, }: {
        gasUsed: number;
        preExecSuccess: boolean;
        tx: Tx;
        usdValue: number;
    }) => Promise<{
        is_gasless: boolean;
        desc?: string;
        promotion?: {
            id: string;
            contract_id: string;
            chain_id: string;
            config: {
                button_text: string;
                before_click_text: string;
                after_click_text: string;
                logo: string;
                theme_color: string;
                dark_color: string;
            };
        };
    }>;
    parseTx: ({ chainId, tx, origin, addr, }: {
        chainId: string;
        tx: Tx;
        origin: string;
        addr: string;
    }) => Promise<ParseTxResponse>;
    isSuspiciousToken: (id: string, chainId: string) => Promise<{
        is_suspicious: boolean;
    }>;
    depositCexSupport: (id: string, chainId: string, cexId: string) => Promise<{
        support: boolean;
    }>;
    depositCexList: (id: string, chainId: string) => Promise<{
        cex_list: Cex[];
    }>;
    getContractCredit: (id: string, chainId: string) => Promise<ContractCredit>;
    hasInteraction: (addr: string, chainId: string, contractId: string) => Promise<{
        has_interaction: boolean;
    }>;
    tokenApproveExposure: (id: string, chainId: string) => Promise<{
        usd_value: number;
    }>;
    addrDesc: (id: string) => Promise<AddrDescResponse>;
    hasTransfer: (chainId: string, from: string, to: string) => Promise<{
        has_transfer: boolean;
    }>;
    isTokenContract: (chainId: string, id: string) => Promise<{
        is_token: boolean;
    }>;
    addrUsedChainList: (id: string) => Promise<UsedChain[]>;
    getTokenNFTExposure: (chainId: string, id: string) => Promise<{
        usd_value: number;
    }>;
    getCollection: (chainId: string, id: string) => Promise<{
        collection: CollectionWithFloorPrice;
    }>;
    isSuspiciousCollection: (chainId: string, id: string) => Promise<{
        is_suspicious: boolean;
    }>;
    isOriginVerified: (origin: string) => Promise<{
        is_verified: boolean | null;
    }>;
    parseTypedData: ({ typedData, origin, address, }: {
        typedData: Record<string, any>;
        origin: string;
        address: string;
    }) => Promise<ParseTypedDataResponse>;
    parseText: ({ text, origin, address, }: {
        text: string;
        origin: string;
        address: string;
    }) => Promise<ParseTextResponse>;
    collectionList: ({ id, chainId, isAll, }: {
        id: string;
        chainId?: string | undefined;
        isAll: boolean;
    }) => Promise<CollectionList[]>;
    gasPriceStats: (chainId: string) => Promise<{
        median: number;
    }>;
    badgeHasClaimed: (id: string) => Promise<{
        id: string;
        badge_id: number;
        user_id: string;
        inner_id: number;
        create_at: number;
        update_at: number;
        has_claimed: true;
    } | {
        has_claimed: false;
    }>;
    badgeHasMinted: (id: string) => Promise<{
        id: string;
        badge_id: number;
        user_id: string;
        inner_id: number;
        usd_value: number;
        tvf: number;
        mint_at: number;
        has_minted: true;
    } | {
        has_minted: false;
    }>;
    mintBadge: (params: {
        code: string;
        userAddr: string;
    }) => Promise<{
        is_success: boolean;
        inner_id: number;
    }>;
    badgeHasClaimedByName: ({ id, name, }: {
        id: string;
        name: string;
    }) => Promise<{
        id: string;
        badge_id: number;
        user_id: string;
        inner_id: number;
        create_at: number;
        update_at: number;
        has_claimed: true;
    } | {
        has_claimed: false;
    }>;
    badgeHasMintedByName: ({ id, name, }: {
        id: string;
        name: string;
    }) => Promise<{
        id: string;
        badge_id: number;
        user_id: string;
        inner_id: number;
        usd_value: number;
        tvf: number;
        mint_at: number;
        has_minted: true;
    } | {
        has_minted: false;
    }>;
    mintBadgeByName: (params: {
        name: string;
        code: string;
        userAddr: string;
    }) => Promise<{
        is_success: boolean;
        inner_id: number;
    }>;
    userHasRequestedFaucet: (params: {
        chain_id: string;
        user_addr: string;
    }) => Promise<{
        has_requested: boolean;
    }>;
    requestFaucet: (params: {
        chain_id: string;
        user_addr: string;
    }) => Promise<{
        is_success: boolean;
    }>;
    gasSupportedPushType: (chainId: string) => Promise<{
        low_gas: boolean;
        mev: boolean;
    }>;
    submitTx: (postData: {
        req_id?: string;
        tx: Tx;
        push_type: TxPushType;
        is_gasless: boolean;
        log_id: string;
        low_gas_deadline?: number;
        origin?: string;
    }) => Promise<{
        req: TxRequest;
    }>;
    getTxRequests: (ids: string | string[]) => Promise<TxRequest[]>;
    getTxRequest: (id: string) => Promise<TxRequest>;
    withdrawTx: (reqId: string) => Promise<{
        req: TxRequest;
    }>;
    retryPushTx: (reqId: string) => Promise<{
        req: TxRequest;
    }>;
    mempoolChecks: (txId: string, chainId: string, node_info?: boolean) => Promise<MempoolCheckDetail[]>;
    getPendingTxList: (params: {
        chain_id: string;
    }, options?: Parameters<typeof this.asyncJob>[1]) => Promise<{
        pending_tx_list: PendingTxItem[];
        token_dict: Record<string, TokenItem | NFTItem>;
    }>;
    getLatestPreExec: (params: {
        id: string;
    }) => Promise<LatestExplainTxResponse>;
    walletSupportChain: (params: {
        chain_id: string;
        user_addr: string;
    }) => Promise<{
        is_success: boolean;
        count: number;
    }>;
    walletSupportOrigin: (params: {
        origin: string;
        user_addr: string;
        text: string;
    }) => Promise<{
        is_success: boolean;
        count: number;
    }>;
    walletSupportSelector: (params: {
        selector: string;
        user_addr: string;
        chain_id: string;
        contract_id: string;
    }) => Promise<{
        is_success: boolean;
        count: number;
    }>;
    searchDapp: (params?: {
        q?: string;
        chain_id?: string;
        start?: number;
        limit?: number;
    }) => Promise<{
        page: {
            limit: number;
            start: number;
            total: number;
        };
        dapps: BasicDappInfo[];
    }>;
    getDappsInfo: (params: {
        ids: string[];
    }) => Promise<BasicDappInfo[]>;
    getDappHotTags: (params?: {
        limit: number;
    }) => Promise<string[]>;
    getHotDapps: (params?: {
        limit: number;
    }) => Promise<BasicDappInfo[]>;
    getRabbyClaimText: (params: {
        id: string;
        invite_code?: string;
    }) => Promise<{
        id: string;
        text: string;
    }>;
    getRabbySignatureText: (params: {
        id: string;
    }) => Promise<{
        id: string;
        text: string;
    }>;
    getRabbyPoints: (params: {
        id: string;
    }) => Promise<{
        id: string;
        invite_code?: string;
        logo_url: string;
        logo_thumbnail_url: string;
        web3_id: string;
        claimed_points: number;
        total_claimed_points: number;
    }>;
    checkRabbyPointsInviteCode: (params: {
        code: string;
    }) => Promise<{
        invite_code_exist: boolean;
    }>;
    setRabbyPointsInviteCode: (params: {
        id: string;
        signature: string;
        invite_code: string;
    }) => Promise<{
        code: number;
    }>;
    checkRabbyPointClaimable: (params: {
        id: string;
    }) => Promise<{
        claimable: boolean;
    }>;
    getRabbyPointsSnapshot: (params: {
        id: string;
    }) => Promise<{
        id: string;
        address_balance: number;
        metamask_swap: number;
        rabby_old_user: number;
        rabby_nadge: number;
        rabby_nft: number;
        extra_bouns: number;
        claimed: boolean;
        snapshot_at: number;
    }>;
    claimRabbyPointsSnapshot: (params: {
        id: string;
        signature: string;
        invite_code?: string;
    }) => Promise<{
        error_code: number;
        error_msg?: string;
    }>;
    getRabbyPointsTopUsers: (params: {
        id: string;
    }) => Promise<{
        id: string;
        logo_url: string;
        logo_thumbnail_url: string;
        web3_id: string;
        claimed_points: number;
    }[]>;
    getRabbyPointsList: (params: {
        id: string;
    }) => Promise<{
        id: number;
        title: string;
        description: string;
        start_at: number;
        end_at: number;
        claimable_points: number;
    }[]>;
    getRabbyPointsCampaignIsEnded: () => Promise<{
        campaign_is_ended: boolean;
    }>;
    claimRabbyPointsById: (params: {
        campaign_id: number;
        user_id: string;
        signature: string;
    }) => Promise<{
        error_code: number;
    }>;
    getRabbyPointsV2: (params: {
        id: string;
    }) => Promise<{
        id: string;
        invite_code?: string;
        logo_url: string;
        logo_thumbnail_url: string;
        web3_id: string;
        claimed_points: number;
        total_claimed_points: number;
    }>;
    getRabbySignatureTextV2: (params: {
        id: string;
    }) => Promise<{
        id: string;
        text: string;
    }>;
    getRabbyClaimTextV2: (params: {
        id: string;
        invite_code?: string;
    }) => Promise<{
        id: string;
        text: string;
    }>;
    setRabbyPointsInviteCodeV2: (params: {
        id: string;
        signature: string;
        invite_code: string;
    }) => Promise<{
        code: number;
    }>;
    checkRabbyPointsInviteCodeV2: (params: {
        code: string;
    }) => Promise<{
        invite_code_exist: boolean;
    }>;
    claimRabbyPointsSnapshotV2: (params: {
        id: string;
        signature: string;
        invite_code?: string;
    }) => Promise<{
        error_code: number;
        error_msg?: string;
    }>;
    getRabbyPointsTopUsersV2: (params: {
        id: string;
    }) => Promise<{
        id: string;
        logo_url: string;
        logo_thumbnail_url: string;
        web3_id: string;
        claimed_points: number;
    }[]>;
    getRabbyPointsListV2: (params: {
        id: string;
    }) => Promise<{
        id: number;
        title: string;
        description: string;
        start_at: number;
        end_at: number;
        claimable_points: number;
    }[]>;
    claimRabbyPointsByIdV2: (params: {
        campaign_id: number;
        user_id: string;
        signature: string;
    }) => Promise<{
        error_code: number;
    }>;
    getRabbyPointsSnapshotV2: (params: {
        id: string;
    }) => Promise<{
        id: string;
        wallet_balance_reward: number;
        active_stats_reward: number;
        extra_bouns: number;
        claimed: boolean;
        snapshot_at: number;
        claimed_points: number;
    }>;
    checkRabbyPointClaimableV2: (params: {
        id: string;
    }) => Promise<{
        claimable: boolean;
    }>;
    checkClaimInfoV2: (params: {
        id: string;
    }) => Promise<{
        claimable_points: number;
        claimed_points: number;
    }>;
    getRabbyPointsCampaignIsEndedV2: () => Promise<{
        campaign_is_ended: boolean;
    }>;
    getSupportedChains: () => Promise<SupportedChain[]>;
    searchChainList: (params?: {
        limit?: number;
        start?: number;
        q?: string;
    }) => Promise<{
        page: {
            start: number;
            limit: number;
            total: number;
        };
        chain_list: ChainListItem[];
    }>;
    getChainListByIds: (params: {
        ids: string;
    }) => Promise<ChainListItem[]>;
    getHistoryCurve: (addr: string) => Promise<HistoryCurve>;
    getHistoryCurveSupportedList: () => Promise<{
        supported_chains: string[];
    }>;
    getHistoryCurveStatus: (params: {
        id: string;
    }) => Promise<{
        failed_msg: Record<string, string>;
        id: string;
        status: 'pending' | 'running' | 'finished' | 'failed';
        update_at: number;
    }>;
    initHistoryCurve: (params: {
        id: string;
    }) => Promise<{
        success: boolean;
    }>;
    getNodeStatusList: () => Promise<NodeStatus[]>;
    getNodeStatusDetail: (params: {
        chain_id: string;
    }) => Promise<NodeStatusDetail>;
    postActionLog: (body: {
        id: string;
        type: 'tx' | 'typed_data' | 'text';
        rules: {
            id: string;
            level: string | null;
        }[];
    }) => Promise<any>;
    checkSpoofing: ({ from, to, }: {
        from: string;
        to: string;
    }) => Promise<{
        is_spoofing: boolean;
    }>;
    getAddressByDeBankId: (name: string) => Promise<{
        addr: string;
        web3_id: string;
    }>;
    getBridgeSupportChain: () => Promise<string[]>;
    getBridgeAggregatorList: () => Promise<BridgeAggregator[]>;
    getBridgePairList: (params: {
        aggregator_ids: string[];
        to_chain_id: string;
        user_addr: string;
    }) => Promise<BridgeTokenPair[]>;
    getBridgeQuoteList: (params: {
        aggregator_ids: string;
        user_addr: string;
        from_chain_id: string;
        from_token_id: string;
        from_token_raw_amount: string;
        to_chain_id: string;
        to_token_id: string;
    }) => Promise<Omit<BridgeQuote, 'tx'>[]>;
    getBridgeQuote: (params: {
        aggregator_id: string;
        bridge_id: string;
        user_addr: string;
        from_chain_id: string;
        from_token_id: string;
        from_token_raw_amount: string;
        to_chain_id: string;
        to_token_id: string;
    }) => Promise<BridgeQuote>;
    getBridgeHistoryList: (params: {
        user_addr: string;
        start: number;
        limit: number;
    }) => Promise<{
        history_list: BridgeHistory[];
        total_cnt: number;
    }>;
    postBridgeHistory: (params: {
        aggregator_id: string;
        bridge_id: string;
        from_chain_id: string;
        from_token_id: string;
        from_token_amount: string | number;
        to_chain_id: string;
        to_token_id: string;
        to_token_amount: string | number;
        tx_id: string;
        tx: Tx;
        rabby_fee: number;
    }) => Promise<{
        success: boolean;
    }>;
    getSupportedDEXList: () => Promise<{
        dex_list: string[];
    }>;
    createDbkBridgeHistory: (postData: Pick<DbkBridgeHistoryItem, 'user_addr' | 'from_chain_id' | 'to_chain_id' | 'tx_id' | 'from_token_amount'>) => Promise<{
        success: boolean;
    }>;
    getDbkBridgeHistoryList: (params: {
        user_addr: string;
        start?: number;
        limit?: number;
    }) => Promise<{
        page: {
            total: number;
            limit: number;
            start: number;
        };
        data: DbkBridgeHistoryItem[];
    }>;
}
export {};

import type { AxiosRequestConfig } from 'axios';
export declare type InitOptions = {
    /**
     * @deprecated legacy option, don't need to use it anymore
     */
    webHf?: string;
};
export interface luxApiPlugin {
    onInitiateAsync?: (options?: InitOptions) => Promise<void>;
    onInitiate?: (options?: InitOptions) => Promise<void>;
    onSignRequest: (ctx: {
        axiosRequestConfig: AxiosRequestConfig<any>;
        parsed: {
            params: any;
            method: string;
            url: string;
        };
    }) => Promise<void>;
}

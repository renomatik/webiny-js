import { ITaskEvent } from "~/handler/types";
import { TaskResponseStatus } from "~/types";
import {
    IResponse,
    IResponseAbortedResult,
    IResponseContinueParams,
    IResponseContinueResult,
    IResponseDoneParams,
    IResponseDoneResult,
    IResponseErrorParams,
    IResponseErrorResult,
    IResponseFromParams,
    IResponseResult
} from "./abstractions";
import { ResponseContinueResult } from "~/response/ResponseContinueResult";
import { ResponseDoneResult } from "~/response/ResponseDoneResult";
import { ResponseErrorResult } from "~/response/ResponseErrorResult";
import { ResponseAbortedResult } from "./ResponseAbortedResult";
import { getErrorProperties } from "~/utils/getErrorProperties";

export class Response implements IResponse {
    public readonly event: ITaskEvent;

    public constructor(event: ITaskEvent) {
        this.event = event;
    }

    public from(params: IResponseFromParams): IResponseResult {
        switch (params.status) {
            case TaskResponseStatus.DONE:
                return this.done(params);
            case TaskResponseStatus.CONTINUE:
                return this.continue(params);
            case TaskResponseStatus.ERROR:
                return this.error(params);
        }
    }

    public continue(params: IResponseContinueParams): IResponseContinueResult {
        return new ResponseContinueResult({
            input: params.input,
            webinyTaskId: params?.webinyTaskId || this.event.webinyTaskId,
            webinyTaskDefinitionId: this.event.webinyTaskDefinitionId,
            tenant: params?.tenant || this.event.tenant,
            locale: params?.locale || this.event.locale,
            wait: params.wait
        });
    }

    public done(params?: IResponseDoneParams): IResponseDoneResult {
        return new ResponseDoneResult({
            webinyTaskId: params?.webinyTaskId || this.event.webinyTaskId,
            webinyTaskDefinitionId: this.event.webinyTaskDefinitionId,
            tenant: params?.tenant || this.event.tenant,
            locale: params?.locale || this.event.locale,
            message: params?.message
        });
    }

    public aborted(): IResponseAbortedResult {
        return new ResponseAbortedResult({
            webinyTaskId: this.event.webinyTaskId,
            webinyTaskDefinitionId: this.event.webinyTaskDefinitionId,
            tenant: this.event.tenant,
            locale: this.event.locale
        });
    }

    public error(params: IResponseErrorParams): IResponseErrorResult {
        return new ResponseErrorResult({
            webinyTaskId: params.webinyTaskId || this.event.webinyTaskId,
            webinyTaskDefinitionId: this.event.webinyTaskDefinitionId,
            tenant: params.tenant || this.event.tenant,
            locale: params.locale || this.event.locale,
            error: params.error instanceof Error ? getErrorProperties(params.error) : params.error
        });
    }
}

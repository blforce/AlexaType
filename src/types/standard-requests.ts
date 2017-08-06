
interface User {
    userId: string;
    accessToken: string;
    permissions: {
        consentToken: string;
    };
}

interface Device {
    deviceId: string;
    supportedInterfaces: {
        AudioPlayer: any;
    }
}

interface AudioPlayer {
    token: string;
    offsetInMilliseconds: number;
    playerActivity: string;
}

interface Application {
    applicationId: string;
}

interface System {
    application: Application;
    user: User;
    device: Device;
    apiEndpoint: string;
}

interface Context {
    system: System;
    AudioPlayer: AudioPlayer;
}

interface Session {
    new: boolean;
    sessionId: string;
    application: Application;
    attributes: any;
    user: User;
    context: Context;
}

export interface Request<T extends StandardRequest> {
    version: string;
    session: Session;
    request: T;
}

export interface StandardRequest {
    type: RequestTypes;
    requestId: string;
    timestamp: string;
    locale: string;
}

export interface LaunchRequest extends StandardRequest { }

export enum RequestTypes { LaunchRequest = "LaunchRequest", IntentRequest = "IntentRequest", SessionEndedRequest = "SessionEndedRequest" };
export enum SessionEndedErrorTypes { InvalidResponse = "INVALID_RESPONSE", DeviceCommunicationError = "DEVICE_COMMUNICATION_ERROR", InternalError = "INTERNAL_ERROR" };
export enum SessionEndedReasons { UserInitiated = "USER_INITIATED", Error = "ERROR", ExceededMaxReprompts = "EXCEEDED_MAX_REPROMPTS" };

export interface SessionEndedRequest extends StandardRequest {
    reason: string;
    error: {
        type: SessionEndedErrorTypes;
        message: string;
    };
}

export enum ConfirmationStatuses { None = "NONE", Denied = "DENIED", Confirmed = "CONFIRMED" };
export enum DialogStates { Started = "STARTED", InProgress = "IN_PROGRESS", Completed = "COMPLETED" };
export enum ResolutionStatuses { Match = "ER_SUCCESS_MATCH", NoMatch = "ER_SUCCESS_NO_MATCH", ErrorTimeout = "ER_ERROR_TIMEOUT", ErrorException = "ER_ERROR_EXCEPTION" };
export type PromiseCallback<T> = (value?: T | Thenable<T>) => void;
export type PromiseError = (error?: any) => void;

interface ResolutionValue {
    value: {
        name: string;
        id: string;
    };
}

interface Resolution {
    authority: string;
    status: {
        code: ResolutionStatuses;
    };
    values: Array<ResolutionValue>;
}

interface Slot {
    name: string;
    value: string;
    confirmationStatus: ConfirmationStatuses;
    resolutions?: {
        resolutionsPerAuthority: Array<Resolution>;
    };
}

export interface Intent {
    name: string;
    confirmationStatus: ConfirmationStatuses;
    slots: {[key:string]:Slot};
}

export interface IntentRequest extends StandardRequest {
    dialogState: string;
    intent: Intent;
}
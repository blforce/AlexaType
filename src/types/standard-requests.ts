
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
    type: string;
    requestId: string;
    timestamp: string;
    locale: string;
}

export interface LaunchRequest extends StandardRequest { }

export type SessionEndedErrorTypes = "INVALID_RESPONSE" | "DEVICE_COMMUNICATION_ERROR" | "INTERNAL_ERROR";
export type SessionEndedReasons = "USER_INITIATED" | "ERROR" | "EXCEEDED_MAX_REPROMPTS";

export interface SessionEndedRequest extends StandardRequest {
    reason: string;
    error: {
        type: SessionEndedErrorTypes;
        message: string;
    };
}

export type ConfirmationStatuses = "NONE" | "DENIED" | "CONFIRMED";
export type DialogStates = "STARTED" | "IN_PROGRESS" | "COMPLETED";
export type ResolutionStatuses = "ER_SUCCESS_MATCH" | "ER_SUCCESS_NO_MATCH" | "ER_ERROR_TIMEOUT" | "ER_ERROR_EXCEPTION";

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

interface Intent {
    name: string;
    confirmationStatus: ConfirmationStatuses;
    slots: Record<string, Slot>;
}

export interface IntentRequest extends StandardRequest {
    dialogState: string;
    intent: Intent;
}
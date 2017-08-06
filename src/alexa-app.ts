
import * as StandardRequests from './types/standard-requests';
import StateHandler from './state-handler';
import Response from './types/standard-response';
import { RequestTypes, PromiseCallback, PromiseError } from "./types/standard-requests";


export interface AlexaAppOptions {
    appId: string;
    resources: any;
}

export default class AlexaApp {

    protected stateHandlers: {[key:string]: {new (app: AlexaApp): StateHandler}} = {};

    private defaultState: string;

    protected get state(): string {
        if('state' in this.appAttributes) {
            return this.appAttributes.state;
        }

        return this.defaultState;
    }

    public setState(state: {new (app: AlexaApp): StateHandler}) {
        this.appAttributes.state = state.toString();
    }

    protected get appAttributes(): {[key:string]:any} {
        if(!('app_attributes' in this.attributes))
            this.attributes.app_attributes = {};

        return this.attributes.app_attributes;
    }

    public event: StandardRequests.Request<StandardRequests.StandardRequest>;
    protected callback: any;
    public attributes: {[key:string]:any};

    public constructor(
        public launchHandler?: (app: AlexaApp) => Promise<Response>, 
        public sessionEnded?: (app: AlexaApp) => Promise<any>) { }

    public async handler(
        event: StandardRequests.Request<StandardRequests.StandardRequest>, 
        context: any, callback: any): Promise<void> {

        this.event = event;
        this.attributes = event.session.attributes || {};

        var response: Response;

        try {
            switch(event.request.type) {
                case RequestTypes.LaunchRequest:
                    if(this.launchHandler == undefined) return;
                    response = await this.launchHandler(this);
                    break;

                case RequestTypes.SessionEndedRequest:
                    if(this.sessionEnded == undefined) return;
                    await this.sessionEnded(this);
                    break;

                case RequestTypes.IntentRequest:
                    response = await this.handleIntent();
                    break;
            }
        } catch(err) {
            console.error(err);
            console.trace();
        }
        
        response.sessionAttributes = this.attributes;
        callback(null, response);
    }

    public setDefaultHandler(handler: {new (app: AlexaApp): StateHandler}): void {
        this.defaultState = handler.toString();
        this.addState(handler);
    }

    public addState(handler: {new (app: AlexaApp): StateHandler} ): void {
        this.stateHandlers[handler.toString()] = handler;
    }

    async handleIntent(): Promise<Response> {

        if(!(this.state in this.stateHandlers)) {
            throw `State ${this.state} not registered.`;
        }
        
        var handler = new this.stateHandlers[this.state](this);
        return await handler.handleEvent(this.event as StandardRequests.Request<StandardRequests.IntentRequest>);
    }
}
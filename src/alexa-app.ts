
import * as StandardRequests from './types/standard-requests';
import StateHandler from './state-handler';
import Response from './types/standard-response';
import { RequestTypes, PromiseCallback, PromiseError } from "./types/standard-requests";


export interface AlexaAppOptions {
    appId: string;
    resources: any;
}

const DEFAULT_STATE = '__DEFAULT__';

export default class AlexaApp {

    protected stateHandlers: {[key:string]: {new (app: AlexaApp): StateHandler}} = {};

    protected state: string = DEFAULT_STATE;

    public event: StandardRequests.Request<StandardRequests.StandardRequest>;
    protected callback: any;

    public constructor(
        public launchHandler?: (app: AlexaApp) => Promise<Response>, 
        public sessionEnded?: (app: AlexaApp) => Promise<any>) { }

    public async handler(
        event: StandardRequests.Request<StandardRequests.StandardRequest>, 
        context: any, callback: any): Promise<void> {

        this.event = event;
        
        if('state' in event.session.attributes) {
            this.state = event.session.attributes.state;
        }

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
        
        callback(null, response);
    }

    public setDefaultHandler(handler: {new (app: AlexaApp): StateHandler}): void {
        return this.addState(DEFAULT_STATE, handler);
    }

    public addState(name: string, handler: {new (app: AlexaApp): StateHandler} ): void {
        this.stateHandlers[name] = handler;
    }

    async handleIntent(): Promise<Response> {

        if(!(this.state in this.stateHandlers)) {
            throw `State ${this.state} not registered.`;
        }
        
        var handler = new this.stateHandlers[this.state](this);
        return await handler.handleEvent(this.event as StandardRequests.Request<StandardRequests.IntentRequest>);
    }
}
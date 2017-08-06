

import AlexaApp from "./alexa-app";
import Response from "./types/standard-response";
import * as StandardRequests from './types/standard-requests';

export default class StateHandler {
    constructor(protected app: AlexaApp) { }

    protected event: StandardRequests.Request<StandardRequests.IntentRequest>

    protected get intent(): StandardRequests.Intent {
        return this.event.request.intent;
    }

    public async handleEvent(inputEvent: StandardRequests.Request<StandardRequests.IntentRequest>): Promise<Response> {
        this.event = inputEvent;

        if(!(this.intent.name in this)) {
            throw `Intent ${this.intent.name} not implemented in ${this.constructor.toString()}.`;
        }

        var intentHandler = this[this.intent.name] as () => Promise<Response>;

        return await intentHandler();
        
    }
}
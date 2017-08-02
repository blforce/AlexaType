
import * as AlexaSdk from 'alexa-sdk';
import 'reflect-metadata';
import AlexaApp from "./alexa-app";

export default class StateHandler {

    constructor(public app: AlexaApp, public handlerContext: AlexaSdk.Handler<AlexaSdk.IntentRequest>) {
    }

    protected emit(event: string, ...args: any[]) {
        this.app.alexa.emit(event, args);
    }

    protected tell(...args: any[]) {
        this.emit(':tell', args);
    }

    protected delegateDialog(): boolean {
        if(this.app.event.request.dialogState !== 'COMPLETED') {
            this.app.alexa.emit(':delegate');
            return true;
        }

        return false;
    }

    protected getSlot(slot: string): any {

        if(this.app.event.request.intent == undefined) return undefined;

        if(!(slot in this.app.event.request.intent.slots)) return undefined;

        return this.app.event.request.intent.slots[slot].value;
    }
}
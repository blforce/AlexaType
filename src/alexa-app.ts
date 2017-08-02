
import * as AlexaSdk from 'alexa-sdk';
import {RegisteredStates, RegisteredState} from './decorators'

export interface AlexaAppOptions {
    appId: string;
    resources: any;
}

export default class AlexaApp {

    public alexa: AlexaSdk.AlexaObject<any>;

    public static handler(event: AlexaSdk.RequestBody<AlexaSdk.IntentRequest>, context: AlexaSdk.Context) {
        var app = new AlexaApp(event, context, {
            appId: process.env.APP_ID,
            resources: require('./language-strings.json')
        });

        app.execute();
    }

    constructor(public event: AlexaSdk.RequestBody<AlexaSdk.IntentRequest>, public context: AlexaSdk.Context, public options: AlexaAppOptions) {
        this.alexa = AlexaSdk.handler<any>(event, context);

        if(options !== undefined) {
            if(options.appId)
                this.alexa.appId = options.appId;

            if(options.resources)
                this.alexa['resources'] = options.resources;
        }

        this.RegisterHandlers();
    }

    public execute() {
        this.alexa.execute();
    }

    private RegisterHandlers() {
        var defaultState = RegisteredStates.defaultState;
        var handlers = [];

        handlers.push(AlexaSdk.CreateStateHandler('', this.BuildStateHandler(defaultState)));

        for(var state in RegisteredStates.states) {
            if(state === defaultState) continue;

            handlers.push(AlexaSdk.CreateStateHandler(state, this.BuildStateHandler(state)))
        }

        this.alexa.registerHandlers(handlers: handlers);
    }

    private BuildStateHandler(stateName: string) {
        var state = RegisteredStates.states[stateName];
        var result = {};

        for(var intent in state.handlers) {
            result[intent] = this.BuildIntentHandlerFunction(state, intent);
        }

        return result;
    }

    private BuildIntentHandlerFunction(state: RegisteredState, intent: string): Function {
        const app = this;
        const funcName = state.handlers[intent];
        return () => {
            var handler = state.construct(app, this);
            return handler[funcName]();
        }
    }
}
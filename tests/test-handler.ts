
import StateHandler from '../src/state-handler';
import {Intent, RegisteredStates, DefaultState} from '../src/decorators';
import AlexaApp from "../src/alexa-app";

@DefaultState
class TestHandler extends StateHandler {

    public static handlers = {};

    @Intent('IntentNameTest')
    DefaultIntent() {}
}

var app = new AlexaApp(undefined, undefined, undefined);
console.log('Handlers:', JSON.stringify(RegisteredStates))
console.log('Default Handler:', RegisteredStates.defaultState);

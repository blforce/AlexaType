

import AlexaApp from "./alexa-app";
import StateHandler from './state-handler';
import Response from './types/standard-response';

let app = new AlexaApp();

class defaultHandler extends StateHandler {
    public async TestDialog(): Promise<Response> {
        var result = new Response(true);
        result.addPlainSpeech("It's working!");

        return result;
    }
}

app.setDefaultHandler(defaultHandler);
app.addState(defaultHandler);

export const handler = (event, context, callback) => app.handler(event, context, callback);

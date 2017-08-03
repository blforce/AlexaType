
import * as StandardRequests from './types/standard-requests';
import Response, {PlainTextSpeech} from './types/standard-response';


export interface AlexaAppOptions {
    appId: string;
    resources: any;
}

export default class AlexaApp {

    public handler(event: StandardRequests.Request<StandardRequests.StandardRequest>, context: any, callback: any) {
        console.info("Request Type: ", event.request.type);

        var response = new Response(true);
        response.response.outputSpeech = new PlainTextSpeech('Hello World!!');
        callback(null, response);
    }
}
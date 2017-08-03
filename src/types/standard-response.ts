
export enum OutputSpeechTypes { PlainText = "PlainText", SSML = "SSML" };

interface OutputSpeech {
    type: OutputSpeechTypes;
}

export class PlainTextSpeech implements OutputSpeech {
    type = OutputSpeechTypes.PlainText;

    constructor(public text: string) { }
}

export class SSMLSpeech implements OutputSpeech {
    type = OutputSpeechTypes.PlainText;

    constructor(public ssml: string) { }
}

export enum CardTypes {Simple = "Simple", Standard = "Standard", LinkAccount = "LinkAccount"};

interface Card {
    type: CardTypes;
}

class SimpleCard implements Card {
    type = CardTypes.Simple;

    constructor(public title: string, public content: string) { }
}

class StandardCard implements Card {
    type = CardTypes.Standard;

    constructor(public title: string, public text: string, smallImage: string, largeImage: string) {
        this.image.smallImageUrl = smallImage;
        this.image.largeImageUrl = largeImage;
    }

    image: {
        smallImageUrl: string;
        largeImageUrl: string;
    };
}

class LinkAccountCard implements Card {
    type = CardTypes.LinkAccount;
}

interface ResponseBody {
    outputSpeech?: OutputSpeech;
    card?: Card;
    reprompt?: {
        outputSpeech: OutputSpeech;
    };
    directives?: Array<any>; // TODO: Define available directives
    shouldEndSession?: boolean;
}

export interface IResponse {
    version: string;
    sessionAttributes?: Record<string, any>;
    response: ResponseBody;
}


export default class Response implements IResponse {
    version = "1.0";
    response = {} as ResponseBody;

    constructor(endSession: boolean) {
        this.response.shouldEndSession = endSession;
    }
}
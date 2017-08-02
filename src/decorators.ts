

import 'reflect-metadata';

const handlers: IRegisteredStates = {
	defaultState: '',
	states: {}
};

export const RegisteredStates: IRegisteredStates = handlers;

interface IRegisteredStates {
	defaultState: string;
	states: any;
}

export interface RegisteredState {
	construct: Function;
	handlers: Object;
}

function getHandler(construct: any): RegisteredState {
	var name = construct.name;

	if(!(name in RegisteredStates)) {
		RegisteredStates.states[name] = {
			construct,
			handlers: {}
		};
	}

	return RegisteredStates.states[name];
}

export const DefaultState = (target: any) => {
	RegisteredStates.defaultState = target.name;
};

// Decorator to register an intent handler
export const Intent = (intentName: string): MethodDecorator => {
	return (
    target: any, 
	key: string,
	descriptor: TypedPropertyDescriptor<any>) => {
		var classConstructor = target.constructor;
		
		var targetHandlers = getHandler(classConstructor);
		targetHandlers.handlers[intentName] = key;
	};
};
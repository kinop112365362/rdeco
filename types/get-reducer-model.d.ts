export function getReducerType(stateKey: any): string;
export function getStateType(rcKey: any): any;
export function getReducerModel(stateKeys: any): () => {
    setState: (nextState: any) => any;
};

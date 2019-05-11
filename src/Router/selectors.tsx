import { IStore } from "../db/interfaces";

export const getAuthRequesting = ({ RouterReducer }: IStore) => {
    return RouterReducer.requesting;
};

export const getAuthFail = ({ RouterReducer }: IStore) => {
    return RouterReducer.failed;
};

export const getAuthState = ({ RouterReducer }: IStore) => {
    return RouterReducer.authenticated;
};
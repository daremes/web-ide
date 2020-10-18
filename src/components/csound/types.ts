const PREFIX = "CSOUND.";

export type CsoundPlayState =
    | "initialized"
    | "stopped"
    | "paused"
    | "playing"
    | "rendering"
    | "error";

// ACTION TYPES
export const SET_CSOUND = PREFIX + "SET_CSOUND";
export const SET_CSOUND_PLAY_STATE = PREFIX + "SET_CSOUND_PLAY_STATE";

export type CsoundInstance = number;

// INTERFACES
export interface ICsound {
    copyToFs: (arrayBuffer: Uint8Array, filePath: string) => Promise<void>;
    rmrfFs: (filePath: string) => Promise<void>;
    csoundSetOption: (
        csound: CsoundInstance,
        option: string
    ) => Promise<number>;
    csoundCompileOrc: (csound: CsoundInstance, orc: string) => Promise<number>;
    csoundCompileCsd: (
        csound: CsoundInstance,
        filePath: string
    ) => Promise<number>;
    csoundCompileCsdText: (
        csound: CsoundInstance,
        csdText: string
    ) => Promise<number>;
    csoundPushMidiMessage: (
        csound: CsoundInstance,
        status: number,
        data1: number,
        data2: number
    ) => Promise<number>;
    csoundStop: (csound: CsoundInstance) => Promise<number>;
    csoundStart: (csound: CsoundInstance) => Promise<number>;
    csoundPause: () => Promise<void>;
    csoundResume: () => Promise<void>;
    getAudioContext: () => Promise<AudioContext>;
    // setCurrentDirFS: (directoryPath: string) => void;
    // writeToFS: (filepath: string, data: any) => void;
    // unlinkFromFS: (filepath: string) => void;
    // compileCSD: (csd: string) => void;
    // compileCSDPromise: (code: string) => any;
    // compileOrc: (orc: string) => void;
    // setOption: (option: string) => void;
    // render: (filepath: string) => void;
    // evaluateCode: (code: string) => void;
    // evaluateCodePromise: (code: string) => any;
    // readScore: (score: string) => void;
    // setControlChannel: (channelName: string, value: number) => void;
    // setStringChannel: (channelNama: string, value: string) => void;
    // requestControlChannel: (channelName: string, callback: () => void) => void;
    // requestStringChannel: (channelName: string, callback: () => void) => void;
    // getControlChannel: (channelName: string) => number;
    // getStringChannel: (channelName: string) => string | number;
    // requestTable: (tableNumber: number, callback: () => void) => void;
    // getTable: (tableNumber: number) => ArrayBuffer;
    // setTableValue: (tableNumber: number, index: number, value: number) => void;
    // setTable: (tableNumber: number, table: ArrayBuffer) => void;
    // setMessageCallback: (messageCallback: (message: string) => void) => void;
    // midiMessage: (byte1: number, byte2: number, byte3: number) => void;
    // enableAudioInput: (audioInputCallback: () => void) => void;
    // enableMidiInput: (midiInputCallback: () => void) => void;
    // getNode: () => AudioNode;
    // start: () => void;
    // reset: () => void;
    // resetIfNeeded: () => void;
    // destroy: () => void;
    // pause: () => void;
    // resume: () => void;
    // play: () => void;
    // stop: () => void;
    // getPlayState: () => ICsoundStatus;
    // addPlayStateListener: (
    //     listener: (csoundObject: ICsoundObject) => void
    // ) => void;
    // removePlayStateListener: (
    //     listener: (csoundObject: ICsoundObject) => void
    // ) => void;
}

export type ICsoundFileType = "csd" | "orc" | "sco" | "udo";

// JUST A MOCK (WIP)
export interface ICsoundOptions {
    messageLevel?: number;
    sampleRate?: number;
    ksmps?: number;
}

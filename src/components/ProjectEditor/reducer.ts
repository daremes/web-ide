import { filter, find, findIndex } from "lodash";
import {
    TAB_DOCK_SWITCH_TAB,
    TAB_DOCK_OPEN_TAB_BY_DOCUMENT_UID,
    TAB_CLOSE,
    STORE_EDITOR_INSTANCE,
    ITabDock
} from "./types";

export interface IProjectEditorReducer {
    tabDock: ITabDock;
}

const initialLayoutState: IProjectEditorReducer = {
    tabDock: {
        tabIndex: -1,
        openDocuments: []
    }
};

export default (
    state: IProjectEditorReducer = initialLayoutState,
    action: any
) => {
    switch (action.type) {
        case TAB_DOCK_SWITCH_TAB: {
            state.tabDock.tabIndex = action.tabIndex;
            return { ...state };
        }
        case TAB_DOCK_OPEN_TAB_BY_DOCUMENT_UID: {
            const currentOpenDocs = state.tabDock.openDocuments;
            const documentAlreadyOpenIndex = findIndex(
                currentOpenDocs,
                od => od.uid === action.documentUid
            );
            if (documentAlreadyOpenIndex < 0) {
                state.tabDock.tabIndex = currentOpenDocs.length;
                currentOpenDocs.push({
                    uid: action.documentUid,
                    editorInstance: null
                });
            } else {
                state.tabDock.tabIndex = documentAlreadyOpenIndex;
            }
            return { ...state };
        }
        case TAB_CLOSE: {
            const currentTabIndex = state.tabDock.tabIndex;
            state.tabDock.tabIndex = Math.min(
                currentTabIndex,
                state.tabDock.openDocuments.length - 2
            );
            state.tabDock.openDocuments = filter(
                state.tabDock.openDocuments,
                od => od.uid !== action.documentUid
            );
            return { ...state };
        }
        case STORE_EDITOR_INSTANCE: {
            const openDocument = find(
                state.tabDock.openDocuments,
                od => od.uid === action.documentUid
            );

            if (!openDocument) {
                return state;
            }
            openDocument.editorInstance = action.editorInstance;
            return { ...state };
        }
        default: {
            return state || initialLayoutState;
        }
    }
};

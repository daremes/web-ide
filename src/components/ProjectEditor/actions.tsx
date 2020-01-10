import React from "react";
import Button from "@material-ui/core/Button";
import { closeModal, openSimpleModal } from "@comp/Modal/actions";
import { resetDocumentValue } from "@comp/Projects/actions";
import { IDocument } from "@comp/Projects/types";
import { sortByStoredTabOrder } from "./utils";
import {
    MANUAL_LOOKUP_STRING,
    TAB_DOCK_OPEN_TAB_BY_DOCUMENT_UID,
    TAB_DOCK_CLOSE,
    TAB_DOCK_INIT,
    TAB_DOCK_REARRANGE_TABS,
    TAB_DOCK_SWITCH_TAB,
    TAB_CLOSE,
    TOGGLE_MANUAL_PANEL,
    SET_MANUAL_PANEL_OPEN,
    STORE_EDITOR_INSTANCE,
    IOpenDocument
} from "./types";

export const tabDockInit = (
    projectUid: string,
    allDocuments: IDocument[],
    defaultTargetDocUid: string
) => {
    const storedIndex = localStorage.getItem(projectUid + ":tabIndex");
    const storedTabOrder: string | null = localStorage.getItem(
        projectUid + ":tabOrder"
    );

    let initialOpenDocuments: IOpenDocument[] = [];
    let initialIndex: number = -1;

    if (
        storedTabOrder &&
        typeof storedTabOrder === "string" &&
        storedTabOrder.length > 0 &&
        storedTabOrder !== "[]"
    ) {
        try {
            const tabOrder = storedTabOrder
                ? (JSON.parse(storedTabOrder) as string[])
                : [];
            const initIndex = storedIndex
                ? (parseInt(storedIndex) as number)
                : -1;

            if (tabOrder.length > 0) {
                initialOpenDocuments = sortByStoredTabOrder(
                    tabOrder,
                    allDocuments
                );
            }
            if (initIndex > -1 && initialOpenDocuments.length > 0) {
                initialIndex = initIndex % initialOpenDocuments.length;
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (initialOpenDocuments.length === 0 && allDocuments.length > 0) {
        initialOpenDocuments.push({
            uid: defaultTargetDocUid,
            editorInstance: null
        });
    }

    if (initialOpenDocuments.length > 0 && initialIndex < 0) {
        initialIndex = 0;
    }

    return async (dispatch: any) => {
        dispatch({ type: TAB_DOCK_INIT, initialOpenDocuments, initialIndex });
    };
};

export const rearrangeTabs = (
    projectUid: string,
    modifiedDock: IOpenDocument[],
    newActiveIndex: number
) => {
    return async (dispatch: any) => {
        dispatch({
            type: TAB_DOCK_REARRANGE_TABS,
            projectUid,
            modifiedDock,
            newActiveIndex
        });
    };
};

export const tabOpenByDocumentUid = (
    documentUid: string,
    projectUid: string
) => {
    return async (dispatch: any) => {
        dispatch({
            type: TAB_DOCK_OPEN_TAB_BY_DOCUMENT_UID,
            documentUid,
            projectUid
        });
    };
};

export const closeTabDock = () => {
    return {
        type: TAB_DOCK_CLOSE
    };
};

const closeUnsavedTabPrompt = (cancelCallback, closeWithoutSavingCallback) => {
    return (() => {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => cancelCallback()}
                    style={{ marginTop: 12 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => closeWithoutSavingCallback()}
                    style={{ marginTop: 12 }}
                >
                    Close without saveing
                </Button>
            </div>
        );
    }) as React.FC;
};

export const tabClose = (
    activeProjectUid: string,
    documentUid: string,
    isModified: boolean
) => {
    return async (dispatch: any) => {
        if (!isModified) {
            dispatch({
                type: TAB_CLOSE,
                documentUid
            });
        } else {
            const cancelCallback = () => dispatch(closeModal());
            const closeWithoutSavingCallback = () => {
                dispatch(closeModal());
                dispatch({
                    type: TAB_CLOSE,
                    documentUid
                });
                dispatch(resetDocumentValue(activeProjectUid, documentUid));
            };

            const closeUnsavedTabPromptComp = closeUnsavedTabPrompt(
                cancelCallback,
                closeWithoutSavingCallback
            );
            dispatch(openSimpleModal(closeUnsavedTabPromptComp));
        }
    };
};

export const tabSwitch = (index: number) => {
    return {
        type: TAB_DOCK_SWITCH_TAB,
        tabIndex: index
    };
};

export const lookupManualString = (manualLookupString: string | null) => {
    return {
        type: MANUAL_LOOKUP_STRING,
        manualLookupString
    };
};

export const toggleManualPanel = () => {
    return {
        type: TOGGLE_MANUAL_PANEL
    };
};

export const setManualPanelOpen = (open: boolean) => {
    return {
        type: SET_MANUAL_PANEL_OPEN,
        open
    };
};

export const storeEditorInstance = (
    editorInstance: any,
    projectUid: string,
    documentUid: string
) => {
    return async (dispatch: any) => {
        dispatch({
            type: STORE_EDITOR_INSTANCE,
            editorInstance,
            projectUid,
            documentUid
        });
    };
};

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
// import MuiTreeView from "material-ui-treeview";
// import Switch from "@material-ui/core/Switch";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FolderIcon from "@material-ui/icons/Folder";
import SettingsIcon from "@material-ui/icons/Settings";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/EditTwoTone";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import * as SS from "./styles";
import { IDocument, IProject } from "../Projects/types";
import { newDocument, deleteFile, renameDocument } from "../Projects/actions";
import { tabOpenByDocumentUid } from "../ProjectEditor/actions";
import { assocPath, pathOr, propOr, type as Rtype, values } from "ramda";
import Tree, {
    MuiTreeData,
    MuiTreeLabelButtonData,
    MuiTreeIconButtonData
} from "material-ui-tree";
import { sortBy } from "lodash";

const FileTree = () => {
    const activeProjectUid = useSelector(
        pathOr(null, ["ProjectsReducer", "activeProjectUid"])
    );

    const project: IProject = useSelector(
        pathOr({} as IProject, [
            "ProjectsReducer",
            "projects",
            activeProjectUid
        ])
    );

    const documents: IDocument = propOr({} as IDocument, "documents", project);

    const dispatch = useDispatch();

    const fileTreeDocs = sortBy(
        values(documents).map((document: IDocument, index: number) => {
            return {
                path: document.filename,
                type: "blob",
                sha: document.documentUid
            };
        }),
        [
            function(d) {
                return d.path;
            }
        ]
    );

    const [state, setState] = useState({
        expandAll: false,
        alignRight: false,
        unfoldAll: false,
        unfoldFirst: false,
        data: {
            unfoldFirst: false,
            unfoldAll: false,
            path: project.name,
            type: "tree",
            tree: fileTreeDocs,
            sha: Math.random()
        }
    });

    React.useEffect(() => {
        setState(assocPath(["data", "tree"], fileTreeDocs));
        // eslint-disable-next-line
    }, []);

    const renderLabel = useCallback(
        (data, unfoldStatus) => {
            const { path, type } = data;
            const rootDirectoryElem = path === project.name;
            let IconComp: any;
            if (type === "tree") {
                if (rootDirectoryElem) {
                    IconComp = FolderOpenIcon;
                } else {
                    IconComp = unfoldStatus ? FolderOpenIcon : FolderIcon;
                }
            }
            if (type === "blob") {
                if (Rtype(data.sha) !== "String") return <></>;
                // variant = "body2";
                if (path.startsWith(".") || path.includes("config")) {
                    IconComp = SettingsIcon;
                } else if (
                    path.endsWith(".csd") ||
                    path.endsWith(".sco") ||
                    path.endsWith(".orc") ||
                    path.endsWith(".udo") ||
                    false
                ) {
                    IconComp = DescriptionIcon;
                } else {
                    IconComp = InsertDriveFileIcon;
                }
            }

            const onFileClick = e => {
                dispatch(tabOpenByDocumentUid(data.sha));
            };
            return (
                <>
                    {rootDirectoryElem ? (
                        <div
                            css={SS.invisibleUnClickableArea}
                            onMouseEnter={e => {
                                e.nativeEvent.stopImmediatePropagation();
                                e.preventDefault();
                            }}
                            onMouseOver={e => {
                                e.nativeEvent.stopImmediatePropagation();
                                e.preventDefault();
                            }}
                            onClick={e => {
                                e.nativeEvent.stopImmediatePropagation();
                                e.preventDefault();
                            }}
                        />
                    ) : (
                        <div
                            css={SS.invisibleClickableArea}
                            onClick={onFileClick}
                        />
                    )}

                    <span css={SS.fileTreeNode} onClick={onFileClick}>
                        <IconComp css={SS.fileIcon} onClick={onFileClick} />
                        <p onClick={onFileClick} css={SS.fileTreeNodeText}>
                            {path}
                        </p>
                    </span>
                </>
            );
        },
        [dispatch, project.name]
    );

    const getActionsData = useCallback(
        (
            data: MuiTreeData,
            path: number[],
            unfoldStatus: boolean,
            toggleFoldStatus: () => void
        ): (MuiTreeLabelButtonData | MuiTreeIconButtonData)[] => {
            const { type } = data;
            if (type === "tree") {
                if (!unfoldStatus) {
                    toggleFoldStatus();
                }
                return {
                    icon: <AddIcon style={{ display: "none" }} />,
                    label: "",
                    hint: "Insert file",
                    onClick: () => dispatch(newDocument(project.projectUid, ""))
                } as any;
            }
            return [
                {
                    icon: (
                        <>
                            <EditIcon css={SS.editIcon} />
                        </>
                    ),
                    hint: "Rename file",
                    onClick: () =>
                        dispatch(
                            renameDocument(
                                propOr("", "sha", data),
                                propOr("", "path", path)
                            )
                        )
                },
                // <div css={SS.eventBlackhole} />
                {
                    icon: (
                        <>
                            <DeleteIcon color="secondary" css={SS.deleteIcon} />
                        </>
                    ),
                    hint: "Delete file",
                    onClick: () => {
                        typeof data.sha === "string" &&
                            dispatch(deleteFile(data.sha));
                    }
                }
            ] as MuiTreeIconButtonData[];
        },
        [project.projectUid, dispatch]
    );

    const requestChildrenData = useCallback((data, path, toggleFoldStatus) => {
        const { type } = data;

        if (type === "blob") {
            toggleFoldStatus();
        }
    }, []);

    return (
        <Tree
            className={" MuiFileTree"}
            css={SS.container}
            data={state.data}
            labelKey="path"
            valueKey="sha"
            childrenKey="tree"
            foldIcon={
                <ArrowDropDownIcon
                    style={{ color: "white" }}
                    fontSize="large"
                />
            }
            unfoldIcon={
                <ArrowDropUpIcon style={{ color: "white" }} fontSize="large" />
            }
            loadMoreIcon={
                <MoreHorizIcon style={{ color: "white" }} fontSize="large" />
            }
            renderLabel={renderLabel}
            pageSize={99999}
            actionsAlignRight={false}
            getActionsData={getActionsData}
            requestChildrenData={requestChildrenData}
        />
    );
};

export default FileTree;

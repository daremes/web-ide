import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, Avatar, ListItemText } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import ListPlayButton from "./ListPlayButton";
import SettingsIcon from "@material-ui/icons/Settings";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import {
    StyledListItemContainer,
    StyledListItemAvatar,
    StyledListItemTopRowText,
    StyledListItemChipsRow,
    StyledUserListItemContainer,
    StyledChip,
    StyledListPlayButtonContainer,
    StyledListButtonsContainer
} from "./ProfileUI";
import { selectCsoundStatus } from "@comp/Csound/selectors";
import { selectFilteredUserFollowing } from "./selectors";
import { editProject } from "./actions";
import * as SS from "./styles";

const ProjectListItem = props => {
    const { isProfileOwner, project } = props;
    const dispatch = useDispatch();
    const { projectUid, name, description, tags } = project;

    return (
        <div style={{ position: "relative" }}>
            <Link to={"/editor/" + projectUid}>
                <ListItem button alignItems="flex-start">
                    <StyledListItemContainer isProfileOwner={isProfileOwner}>
                        <StyledListItemTopRowText>
                            <ListItemText
                                primary={name}
                                secondary={description}
                            />
                        </StyledListItemTopRowText>
                        <StyledListItemChipsRow>
                            {Array.isArray(tags) &&
                                tags.map(
                                    (
                                        t: React.ReactNode,
                                        i: string | number | undefined
                                    ) => {
                                        return (
                                            <StyledChip
                                                color="primary"
                                                key={i}
                                                label={t}
                                            />
                                        );
                                    }
                                )}
                        </StyledListItemChipsRow>
                    </StyledListItemContainer>
                </ListItem>
                {isProfileOwner && <StyledListButtonsContainer />}
            </Link>
            <StyledListPlayButtonContainer>
                <ListPlayButton projectUid={projectUid} />
            </StyledListPlayButtonContainer>
            {isProfileOwner && (
                <div css={SS.settingsIconContainer}>
                    <Tooltip title="Toggle project settings">
                        <div
                            css={SS.settingsIcon}
                            onClick={e => {
                                dispatch(editProject(project));
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <SettingsIcon />
                        </div>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default ({
    profileUid,
    selectedSection,
    isProfileOwner,
    filteredProjects,
    username,
    setProfileUid,
    setSelectedSection
}) => {
    const dispatch = useDispatch();
    const csoundStatus = useSelector(selectCsoundStatus);
    const filteredFollowing = useSelector(
        selectFilteredUserFollowing(profileUid)
    );

    return (
        <List>
            {selectedSection === 0 &&
                Array.isArray(filteredProjects) &&
                filteredProjects.map((p, i) => {
                    return (
                        <ProjectListItem
                            key={p.projectUid}
                            isProfileOwner={isProfileOwner}
                            project={p}
                            csoundStatus={csoundStatus}
                            username={username}
                        />
                    );
                })}
            {selectedSection === 1 &&
                Array.isArray(filteredFollowing) &&
                filteredFollowing.map((p: any, i) => {
                    return (
                        <ListItem
                            button
                            alignItems="flex-start"
                            key={i}
                            onClick={async () => {
                                await dispatch(push(`/profile/${p.username}`));
                                setProfileUid(null);
                                setSelectedSection(0);
                            }}
                        >
                            <StyledUserListItemContainer>
                                <StyledListItemAvatar>
                                    <Avatar src={p.photoUrl} />
                                </StyledListItemAvatar>

                                <StyledListItemTopRowText>
                                    <ListItemText
                                        primary={p.displayName}
                                        secondary={p.bio}
                                    />
                                </StyledListItemTopRowText>
                            </StyledUserListItemContainer>
                        </ListItem>
                    );
                })}
        </List>
    );
};

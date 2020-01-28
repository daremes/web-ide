import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withStyles from "./styles";
import Header from "../Header/Header";
import ProjectCard from "./ProjectCard";
import {
    searchProjects,
    getPopularProjects,
    getTags,
    getStars,
    getProjectLastModified
} from "./actions";
import { CSSTransition } from "react-transition-group";

import {
    HomeContainer,
    SearchContainer,
    StyledTextField,
    ProjectSectionHeader,
    HorizontalRule,
    FeaturedProjectsContainer,
    ProjectSectionCardContainer
} from "./HomeUI";
import {
    selectTags,
    selectStars,
    selectProjectLastModified,
    // selectDisplayedRecentProjects,
    selectDisplayedStarredProjects,
    selectProjectUserProfiles
} from "./selectors";
import { GridList, GridListTile } from "@material-ui/core";

const Home = props => {
    const { classes } = props;
    const dispatch = useDispatch();
    const [showFeaturedProjects, setShowFeaturedProjects] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const tags = useSelector(selectTags);
    const stars = useSelector(selectStars);
    const projectLastModified = useSelector(selectProjectLastModified);
    // const recentProjects = useSelector(selectDisplayedRecentProjects);
    const starredProjects = useSelector(selectDisplayedStarredProjects);
    const projectUserProfiles = useSelector(selectProjectUserProfiles);

    useEffect(() => {
        if (
            Array.isArray(tags) === true &&
            Array.isArray(stars) === true &&
            Array.isArray(projectLastModified) === true
        ) {
            dispatch(getPopularProjects(4));
        }
    }, [dispatch, tags, stars, projectLastModified]);

    useEffect(() => {
        dispatch(getTags());
        dispatch(getStars());
        dispatch(getProjectLastModified());
    }, [dispatch]);

    useEffect(() => {
        if (searchValue.length > 0 && showFeaturedProjects === true) {
            setShowFeaturedProjects(false);
        }

        if (searchValue.length === 0 && showFeaturedProjects === false) {
            setShowFeaturedProjects(true);
        }
    }, [searchValue, setShowFeaturedProjects, showFeaturedProjects]);

    return (
        <div className={classes.root}>
            <Header showMenuBar={false} />
            <main>
                <HomeContainer
                    colorA={"rgba(30, 30, 30, 1)"}
                    colorB={"rgba(40, 40, 40, 1)"}
                    colorC={"rgba(20, 20, 20, 1)"}
                >
                    <SearchContainer>
                        <StyledTextField
                            fullWidth
                            value={searchValue}
                            variant="outlined"
                            id="standard-name"
                            label="Search Projects"
                            className={classes.textField}
                            margin="normal"
                            InputLabelProps={{
                                classes: {
                                    root: classes.cssLabel,
                                    focused: classes.cssFocused
                                }
                            }}
                            InputProps={{
                                classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline
                                },
                                inputMode: "numeric"
                            }}
                            onChange={e => {
                                setSearchValue(e.target.value);
                                dispatch(searchProjects(e.target.value));
                            }}
                            onFocus={e => {}}
                        />
                    </SearchContainer>

                    <CSSTransition
                        in={
                            showFeaturedProjects &&
                            Array.isArray(starredProjects)
                        }
                        classNames="fade"
                        timeout={300}
                        unmountOnExit
                    >
                        {transition => (
                            <FeaturedProjectsContainer>
                                <ProjectSectionHeader row={1}>
                                    Popular Projects
                                    <HorizontalRule />
                                </ProjectSectionHeader>
                                <ProjectSectionCardContainer row={2}>
                                    <GridList cellHeight={300} cols={4}>
                                        {Array.isArray(starredProjects) &&
                                            starredProjects.map((e, i) => {
                                                return (
                                                    <GridListTile key={i}>
                                                        <ProjectCard
                                                            project={e}
                                                            profile={
                                                                projectUserProfiles[
                                                                    e.userUid
                                                                ]
                                                            }
                                                        />
                                                    </GridListTile>
                                                );
                                            })}
                                    </GridList>
                                </ProjectSectionCardContainer>
                            </FeaturedProjectsContainer>
                        )}
                    </CSSTransition>
                </HomeContainer>
            </main>
        </div>
    );
};

export default withStyles(Home);

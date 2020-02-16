import ProjectSearch from "./ProjectSearchShim";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
    projects,
    profiles,
    stars,
    projectLastModified,
    tags
} from "@config/firestore";
import { selectOrderedProjectLastModified } from "./selectors";
import {
    GET_TAGS,
    GET_STARS,
    GET_PROJECT_LAST_MODIFIED,
    GET_DISPLAYED_STARRED_PROJECTS,
    GET_DISPLAYED_RECENT_PROJECTS,
    GET_PROJECT_USER_PROFILES
} from "./types";
import { firestore } from "firebase/app";
const worker = ProjectSearch();

export const searchProjects = (
    query: string
): ThunkAction<void, any, null, Action<string>> => dispatch => {
    worker.projectSearch(query);
};

export const getProjectLastModified = (): ThunkAction<
    void,
    any,
    null,
    Action<string>
> => async dispatch => {
    projectLastModified.onSnapshot(snapshot => {
        const result = snapshot.docs.map(doc => {
            return { projectID: doc.id, timestamp: doc.data().timestamp };
        });
        dispatch({ type: GET_PROJECT_LAST_MODIFIED, payload: result });
    });
};

export const getTags = (): ThunkAction<
    void,
    any,
    null,
    Action<string>
> => async dispatch => {
    tags.onSnapshot(snapshot => {
        const result = snapshot.docs.map(doc => {
            return { tag: doc.id, uids: doc.data() };
        });
        dispatch({ type: GET_TAGS, payload: result });
    });
};

export const getStars = (): ThunkAction<
    void,
    any,
    null,
    Action<string>
> => async dispatch => {
    stars.onSnapshot(snapshot => {
        const result = snapshot.docs.map(doc => {
            return { projectID: doc.id, stars: doc.data().stars };
        });
        dispatch({ type: GET_STARS, payload: result });
    });
};

export const getPopularProjects = (
    count: number
): ThunkAction<void, any, null, Action<string>> => async (
    dispatch,
    getStore
) => {
    const state = getStore();
    const orderedStars = []; //FIXME (hlolli 10/02) selectOrderedStars(state);
    const orderedProjectLastModified = selectOrderedProjectLastModified(state);
    const splitStars = orderedStars
        .splice(0, count)
        .map(e => (e as any).projectID);
    const splitLastModified = orderedProjectLastModified
        .splice(0, count)
        .map(e => e.projectID);

    if (splitStars.length < 1 || splitLastModified.length < 1) {
        return;
    }

    const splitStarProjectsQuery = await projects
        .where("public", "==", true)
        .where(firestore.FieldPath.documentId(), "in", splitStars)
        .get();

    const starProjects: any[] = [];
    const lastModifiedProjects: any[] = [];
    splitStarProjectsQuery.forEach(snapshot => {
        starProjects.push({ id: snapshot.id, ...snapshot.data() });
    });

    const userIDs = [
        ...new Set([
            ...starProjects.map(e => e.userUid),
            ...lastModifiedProjects.map(e => e.userUid)
        ])
    ];

    const projectProfiles = {};

    const profilesQuery = await profiles
        .where(firestore.FieldPath.documentId(), "in", userIDs)
        .get();

    profilesQuery.forEach(snapshot => {
        projectProfiles[snapshot.id] = snapshot.data();
    });

    dispatch({ type: GET_PROJECT_USER_PROFILES, payload: projectProfiles });
    dispatch({ type: GET_DISPLAYED_STARRED_PROJECTS, payload: starProjects });
    dispatch({
        type: GET_DISPLAYED_RECENT_PROJECTS,
        payload: lastModifiedProjects
    });
};
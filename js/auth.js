import { fetchPath } from "../config.js";
import { now } from "./dates.js";
import { route } from "./router.js";

// TODO: cleanup this JWT stuff
export const getJwtToken = () => localStorage.getItem('token');
export const setJwtToken = (token) => localStorage.setItem('token', token);
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setRefreshToken = (refreshToken) => localStorage.setItem('refreshToken', refreshToken);
export const getUsername = () => localStorage.getItem('username');
export const setUsername = (username) => localStorage.setItem('username', username);

// parses token expiry value
const parseJwtExpiry = (tkn) => {
    try {
        const tknPayload = JSON.parse(atob(tkn.split('.')[1]));
        return tknPayload.exp;
    } catch(err) {
        return 0;
    };
};

// appends tokens to headers for verification from server
const updateOptions = (options) => {
    const update = { ...options };
    const token = getJwtToken();
    const refreshToken = getRefreshToken();

    update.headers = {
        ...update.headers,
        token: token,
        refreshToken: refreshToken
    };
    return update;
};

// attempts to refresh token
const attemptTokenRefresh = async () => {
    try {
        const res = await fetch(`${fetchPath}/auth/refreshToken`, updateOptions({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }));
        return res;
    } catch(err) {
        console.trace(err);
        throw err;
    };
};

// determines if stored tokens are authorized and refreshes token if eligible; otherwise, logs out
export const handleUnauthorizedUser = async () => {
    const curDate = now().toSeconds();
    const token = getJwtToken();
    const tokenExpTime = parseJwtExpiry(token);
    const refreshToken = getRefreshToken();
    const refreshExpTime = parseJwtExpiry(refreshToken);
    const username = getUsername();

    const isTokenExpired = tokenExpTime < curDate;
    const isRefreshExpired = refreshExpTime < curDate;

    let isAuthorized = false;

    const hasInvalidTokens = (!token || !refreshToken || tokenExpTime == 0 || refreshExpTime == 0) ? true : false;
    const hasExpiredTokens = (isTokenExpired || isRefreshExpired) ? true : false;
    // if token IS expired but refresh token is NOT
    const isEligibleForRefresh = (isTokenExpired && !isRefreshExpired) ? true : false;

    // if tokens are valid and username is set, user is authorized
    if(!hasInvalidTokens && !hasExpiredTokens && username) {
        isAuthorized = true;
    } else {
        // if user is eligible for refresh, attempt token refresh
        if(isEligibleForRefresh) {
            try {
                const res = await attemptTokenRefresh();
                const data = await res.json();
                setJwtToken(data);
                isAuthorized = true;
            } catch(err) {
                console.trace(err);
            };
        };
    };

    if(!isAuthorized) {
        setJwtToken('');
        setRefreshToken('');
        setUsername('');
        route(event, 'login');
    };
    return isAuthorized;
};

// replaces fetch to make calls from frontend
// runs through frontend token validation then sends tokens through header for server verification
export const fetchAuth = async (url, options) => {
    // verify user authorization
    await handleUnauthorizedUser();
    // if username set to null after authorization, break fetch
    if(getUsername() == '') return;
    
    // run requested fetch call with updated header
    try {
        const res = await fetch(url, updateOptions(options));
        return res;
    } catch {
        throw res;
    };
};
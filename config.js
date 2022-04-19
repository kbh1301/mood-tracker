const envFetchPath = () => {
    const environment = window.location.origin.includes('localhost') ? 'dev' : 'prod';
    const fetchPath = environment == 'dev' ? 'http://localhost:3000' : 'https://kbh1301-mood-tracker-api.herokuapp.com';
    return fetchPath;
};

export const fetchPath = envFetchPath();
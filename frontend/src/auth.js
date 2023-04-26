import { createAuthProvider } from 'react-token-auth';

//Used to login and logout users
export const { useAuth, authFetch, login, logout } = 
    createAuthProvider({
        getAccessToken: 'access_token', //access token to be stored in local storage
        onUpdateToken: (token) =>
            fetch('/user_auth/refresh', {
                method: 'POST',
                body: token.refresh_token,
            })
                .then(r => r.json()),
    });
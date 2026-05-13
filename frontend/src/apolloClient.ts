import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_BACKEND_URL, // URL of your GraphQL backend
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("imagurumiToken");
    const guestId = localStorage.getItem("app_guest_id");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            "x-guest-id": guestId || "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;

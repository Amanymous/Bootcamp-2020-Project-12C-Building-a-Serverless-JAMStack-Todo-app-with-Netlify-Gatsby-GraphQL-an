import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "/.netlify/functions/todolist",
    fetch,
  }),
  cache: new InMemoryCache(),
});

import { ApolloLink } from "@apollo/client/link/core/ApolloLink";
import { setContext } from '@apollo/client/link/context'
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

const uri = environment.apolloUrl;
export function createApollo(httpLink: HttpLink) {
    const basic = setContext((operation, context) => ({
      headers: {
        Accept: 'charset=utf-8',
      },
    }));
   
    const auth = setContext((operation, context) => {
      const token = localStorage.getItem('token');
   
      if (token === null) {
        return {};
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
    });
   
    const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
    const cache = new InMemoryCache();
   
    return {
      link,
      cache,
    };
  }
  
  
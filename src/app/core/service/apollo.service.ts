import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Mutation, Query } from '../generated/generated';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private apollo: Apollo) {}

  mutate(gql: any, para: any): Promise<Mutation> {
    return new Promise((resolve, reject) => {
      this.apollo
        .mutate<Mutation>({
          mutation: gql,
          variables: para,
        })
        .subscribe({
          next(res): any {
            if (res.data) resolve(res.data);
            else reject(null);
          },
          error(err): any {
            reject(err);
          },
        });
    });
  }

  query(gql: any, para: any): Promise<Query> {
    return new Promise((resolve, reject) => {
      this.apollo
        .watchQuery<Query>({
          query: gql,
          variables: para,
        })
        .valueChanges.subscribe({
          next(res): any {
            console.log(res)
            if (res.data) resolve(res.data);
            else reject(null);
          },
          error(err): any {
            reject(err);
          },
        });
    });
  }
}

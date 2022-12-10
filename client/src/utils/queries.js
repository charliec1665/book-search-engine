import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId: ID!
                title: String!
                author: [String!]
                description: String
                image: String
                link: String
            }
        }
    }
`;
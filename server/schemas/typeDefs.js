// import the gql tagged template function (advanced use of template literals)
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId:
        author: [String]
        description: String
        title: String
        image:
        link:
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInfo {
        bookId: ID!
        title: String!
        author: [String!]
        description: String
        image:
        link:
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: BookInfo): User
        removeBook(book: bookId): User
    }
`;

// export the typeDefs
module.exports = typeDefs;
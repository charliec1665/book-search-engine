const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books');
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        
        // get a single user by id or username
        users: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('books');
        },
    },
    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Wrong password!");
            }

            const token = signToken(user);
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        saveBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookId }},
                    { new: true, runValidators: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!')
        },
        // remove a book from 'savedBooks'
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndDelete(
                    {_id: context.user._id },
                    { $pull: { savedBooks: bookId }},
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!')
        }
    }
}

module.exports = resolvers;
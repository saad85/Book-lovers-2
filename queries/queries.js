import apollo from 'apollo-server';

const { ApolloServer, gql } =apollo;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export default gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Review{
    _id: String
    title: String!
    genre: String
    desc: String
    imgId: String
    author: Author
  }

  type User{
    _id: String
    name: String
    email: String
    token: String
  }

  type AddUser{
    name: String!
    email: String!
    password: String!
    imgId: String
  }

  type AddReview{
    title: String!
    genre:String
    desc:String
    imgId:String
    author:String
  }



  type Author{
    _id:String
    name:String!
  }

  type Mutation{
    addReview(title: String, author: String, genre:String, desc:String, imgId:String, reviewerId:String): AddReview
    addAuthor(name: String): Author
    addUser(name: String,email: String, password:String):AddUser
    loginUser(email: String, password:String): User
  }

  input MessageInput {
    _id:String
    genre: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    reviews(query:MessageInput): [Review]
    authors: [Author]
    users(_id: String, name: String, email:String, calledBy: String): [User] 
  }
`;
import { gql } from "@apollo/client";

// eslint-disable-next-line
const MessageInput = gql`{
  input MessageInput {
    _id:String
    genre: String
    author: String
  }
}`
//Books componet
// export const GET_REVIEW = gql`
//   query GetReview($genre: String, $author: String) {
//     reviews(genre:$genre, author:$author) {
//         title
//         genre
//         desc
//         imgId
//         author{
//             name
//         }
//     }
//   }
// `;

export const GET_REVIEW = gql`
  query GetReview($query: MessageInput) {
    reviews(query:$query) {
        _id
        title
        genre
        desc
        imgId
        author{
            name
        }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview(
    $title: String!
    $author: String!
    $genre: String
    $desc: String
    $imgId:String
    $reviewerId:String
  ) {
    addReview(title: $title, author: $author, genre: $genre, desc: $desc, imgId: $imgId,reviewerId:$reviewerId) {
      title
      author
      genre
      desc
    }
  }
`;

export const ADD_AUTHOR = gql`
  mutation AddAuthor($authorName: String!) {
    addAuthor(name: $authorName) {
      name
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $password: String) {
    addUser(name: $name, email: $email, password: $password) {
      name
      email
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id:String, $email: String, $calledBy:String) {
    users(_id:$id email: $email, calledBy:$calledBy) {
      name
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String) {
    loginUser( email: $email, password: $password) {
      _id
      name
      email
      token
    }
  }
`;

export const AUTHORS = gql`
  query GetAuthors {
    authors {
      _id
      name
    }
  }
`;
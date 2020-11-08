import Books from "../models/book.js";
import Review from "../models/review.js";
import AuthorsCollection from "../models/author.js";
import UsersCollection from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Query: {
    books: async () => await Books.find({}),
    
    reviews: async (parent, args, context, info) => {
      let query = {};

      console.log("args",args);

      if (args.query) query = args.query;

      console.log("query",query);

      //console.log("query after mutation",Review.find(query));

      return await Review.find(query);
    },
    
    authors: async () => await AuthorsCollection.find({}),
   
    users: async (parent, args, context, info) => {
      const {_id, email, calledBy } = args;
      
      let query = {};

      query.email = email;

      return await UsersCollection.find(query);
    },
  },
  Review: {
    author: async (book) =>
      await AuthorsCollection.findOne({ _id: book.author }),
  },
  Mutation: {
    addReview: async (
      _,
      { title, author, genre, desc, imgId, reviewerId },
      { dataSources }
    ) => {
      const ReviewCollection = new Review({
        title,
        author,
        genre,
        desc,
        imgId,
        reviewerId
      });

      return await ReviewCollection.save();
    },
    addAuthor: async (_, { name }, { dataSources }) => {

      const authors = new AuthorsCollection({
        name: name,
      });
      return await authors.save();
    },
    addUser: async (_, { name, email, password }, { dataSources }) => {

      let users ={},token='';
      
      if (name && email && password) {

        const hashedPassword = getHashedPassword(password);

        await hashedPassword
          .then(async (hashedPassword) => {
            
            const user = new UsersCollection({
              name,
              email,
              password: hashedPassword,
            });
            
            users = user
          })
          .catch((error) => {
            console.log(error);
          });

          return await users.save();
      }
    },

    loginUser: async(_, { email, password }, { dataSources })=>{
      return await findUserAndComparePassword(email, password);
    }
    
  },
};

const getHashedPassword = (password) => {
  const saltRounds = 10;

  return new Promise(function (resolve, reject) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (hash) resolve(hash);
      else if (err) reject(err);
    });
  });
};

const findUserAndComparePassword = async(email, password) =>{
  const user= await findUser(email);

  let isValidAuth = false,token='';
  

  if(user){
   await comparePassword(password,user).then(async(isMatched)=>  {
     
    isValidAuth = isMatched;
     token = await setJsonWebToken(user);
     
     user.token = token;
  } )
  } else console.log("userFound not found");
  
  return isValidAuth ?  user : {};

}

const setJsonWebToken = (user) =>{
  const jwtSecret = 'SUPERSECRETE20220';

  return jwt.sign(
      {userId: user._id, email: user.email},
      jwtSecret,
      {
        expiresIn: 30000, //500 minutes
      },
    );

}

const findUser = (email) =>{

  return  new Promise((resolve, reject)=>{
    const user =  UsersCollection.findOne({email});

    resolve(user);
  })
  
  
}

const comparePassword = (password,user)=>{

  return bcrypt.compare(password, user.password);
}

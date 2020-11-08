import graphql from 'graphql';
import Books from '../models/book.js';
import Authors from '../models/author.js';

const { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt } = graphql;



const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{ type: GraphQLID },
        name:{ type: new GraphQLNonNull(GraphQLString)  },
        genre:{ type: GraphQLString },
        writerId:{ type: GraphQLString },
        author:{
            type: Author,
            resolve(parent , args){

                return Authors.findOne({_id:parent.writerId});
            }
        }
    })
    
});

const Author = new GraphQLObjectType({
    name :"Author",
    fields:()=>({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType) ,
            resolve(parent, args){

                console.log("parent ",parent );
                return Books.find({writerId:parent._id});
            }
        }
    })
});

const Doctors = new GraphQLObjectType({
    name:"Doctors",
    fields:()=>({
        id: {type: GraphQLID},
        name: { type: GraphQLString},
        age: { type: GraphQLInt}
    })
});

const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        book:{
            type:BookType,
            args:{id: { type:GraphQLID }},
            resolve(parent , args){
                //code to get data from db or other resources
                console.log("Root Query executed ==");

               return Books.findOne({writerId:args.id});
            }
        },
        author:{
            type:Author,
            args:{ id: { type: GraphQLID }},
            resolve(parent,args){

                console.log("Author query executed ");

                return Authors.findOne({_id:args.id});
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent, args){
                console.log("okay for query");
                console.log("args",args);
               return Books.find({});
            }
        },
        authors:{
            type: new GraphQLList(Author),
            resolve(parent, args){
                return Authors.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addAuthor:{
            type:Author,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: GraphQLInt}
            },
            resolve(aprent ,args){
                const authors = new Authors({
                    name: args.name,
                    age: args.age
                });

                return authors.save()
            }
        },
        addBook:{
            type:BookType,
            args:{
                name: {type: GraphQLString},
                genre:{type: GraphQLString},
                writerId: {type: GraphQLString}
            },
            resolve(parent, args){
                const books =new Books({
                    name: args.name,
                    genre: args.genre,
                    writerId: args.writerId
                });

                return books.save();
            }
        }
    }
})

const schema = new GraphQLSchema({
    query:RootQuery,
    mutation : Mutation
});

export default schema;
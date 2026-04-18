import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLInterfaceTypeSearchResult } from '../globalSearch/globalSearchSchema'
import { BlogModel } from './blogModel'

export const GraphQLObjectTypeBlogPost = new GraphQLObjectType({
  name: 'BlogPost',
  interfaces: [GraphQLInterfaceTypeSearchResult],
  isTypeOf: (value: unknown) => value instanceof BlogModel,
  description: 'A blog article',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The title of the blog post',
    },
    href: {
      type: GraphQLString,
      description: 'The URL of the blog post',
    },
    content: {
      type: GraphQLString,
      description: 'The full content of the blog post',
    },
  },
})

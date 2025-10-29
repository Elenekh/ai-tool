//import { base44 } from './base44Client';


//export const AITool = base44.entities.AITool;

//export const BlogPost = base44.entities.BlogPost;

//export const NewsItem = base44.entities.NewsItem;

//export const Author = base44.entities.Author;



// auth sdk:
//export const User = base44.auth;
// Local mock entities to replace Base44
export const AITool = {
  list: async () => [
    { id: 1, name: "Mock AI Writer", category: "Writing" },
    { id: 2, name: "Mock Image Enhancer", category: "Design" },
  ],
};

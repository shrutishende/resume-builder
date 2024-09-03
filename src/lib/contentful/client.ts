//import { createClient } from "contentful-management";
const contentfulManagement = require("contentful-management");

export const client =contentfulManagement.createClient({
  
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});



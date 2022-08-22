import express, { Request, Response, Router } from "express";
import bodyParser from "body-parser";
const fs = require ('fs');
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
(async () => {
  // Init the Express application
  const app = express();
  const router: Router = Router()

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    let {image_url} = req.query;
    if(!image_url){
      return res.send().status(404).json({
        message:"Invalid query Param, Please Try Again!"
      })
    }
      console.log("image_url", image_url)
    try {
      
      const localUrl = await filterImageFromURL(String(image_url))
      res.sendFile(localUrl)
      //after we send the response to the user we will immiedietly delete th picture
      res.on("finish",()=>{
        deleteLocalFiles(Array(localUrl))
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "Image Processing Error please try another Image"
      })
    }
    // console.log(localUrl)

  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

 

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();

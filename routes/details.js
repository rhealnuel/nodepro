const express = require('express')
const myModel = require('../model/myModel')
const { put } = require('@vercel/blob');
const formidable = require('formidable');
const fs = require('fs/promises');
const upload = require('../middleware/upload')
const path = require('path')
require('dotenv').config(); // Load environment variables




const router = express.Router()


// router.post('/details',upload.single('image'),  async(req, res) => {
//     try {
//         if(req.file){
//             req.body.image = req.file.path
//         }
//        const model = await myModel.create(req.body)
//        res.status(200).json(model)

//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message})
//     }


// })

// router.post('/details', upload.single('image'), (req, res) => {
//     const { name, siteLink, gitLink, tools } = req.body; // Assuming these fields come from the request body
  
//     const newEntry = new myModel({
//       name,
//       siteLink,
//       gitLink,
//       tools,
//       image: req.file.path, // Use the 'path' property from 'req.file' to store file path
//     });
  
//     newEntry.save()
//       .then((result) => {
//         res.status(200).json({ message: 'File uploaded and saved to database successfully', result });
//       })
//       .catch((error) => {
//         res.status(500).json({ error });
//       });
//   });


router.post('/details', async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'File parsing error' });
        }

        // Convert array values to strings
        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const siteLink = Array.isArray(fields.siteLink) ? fields.siteLink[0] : fields.siteLink;
        const gitLink = Array.isArray(fields.gitLink) ? fields.gitLink[0] : fields.gitLink;
        const tools = Array.isArray(fields.tools) ? fields.tools[0] : fields.tools;

        const file = files.image?.[0]; // Ensure file exists

        if (!file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const fileBuffer = await fs.readFile(file.filepath); // Read file as buffer

        // Upload file to Vercel Blob
        const { url } = await put(Date.now() + '-' + file.originalFilename, fileBuffer, {
            access: 'public',
        });

        // Save the details, including the image URL, in the database
        const newEntry = new myModel({
            name,
            siteLink,
            gitLink,
            tools,
            image: url,
        });

        newEntry.save()
            .then((result) => {
                res.status(200).json({ message: 'File uploaded and saved successfully', result });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    });
});




router.get('/details', async(req, res) => {
    const detail = await myModel.find()
    res.json(detail)
})

router.get('/details/:id', async(req, res) => {

    try {
        const {id} = req.params;
        const detail1 = await myModel.findById(id)
        res.json(detail1)
    } catch (error) {

        req.body(error.message)
        
    }
})

router.put('/details/:id', async(req, res) => {

     try {
        const {id} = req.params;
        const edit = await myModel.findByIdAndUpdate(id, req.body);
        if(!myModel){
            res.status(404).json({message: `cannot find any product with Id ${id}`})
        }

        const updated = await myModel.findById(id)
        
        res.status(200).json(updated)
     } catch (error) {
        console.log(error.message)
     }
})

router.delete("/details/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const details = await myModel.findByIdAndDelete(id)
        res.json({message: "deleted succesfully"})


    } catch (error) {
        res.status(404).json(error.message)
    }
} )

module.exports = router
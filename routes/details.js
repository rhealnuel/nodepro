const express = require('express')
const myModel = require('../model/myModel')

const upload = require('../middleware/upload')
const path = require('path')



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

router.post('/details', upload.single('image'), (req, res) => {
    const { name, siteLink, gitLink, tools } = req.body; // Assuming these fields come from the request body
  
    const newEntry = new myModel({
      name,
      siteLink,
      gitLink,
      tools,
      image: req.file.path, // Use the 'path' property from 'req.file' to store file path
    });
  
    newEntry.save()
      .then((result) => {
        res.status(200).json({ message: 'File uploaded and saved to database successfully', result });
      })
      .catch((error) => {
        res.status(500).json({ error });
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
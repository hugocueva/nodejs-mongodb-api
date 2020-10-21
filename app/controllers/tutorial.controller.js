const db = require("../models"); 
const Tutorial = db.tutorials; 

const getPagination = (page, size) => {
    const limit = size ? +size : 3; 
    const offset = page ? page * limit : 0; 

    return {limit, offset}; 
}; 

// Create and Save a new Tutorial
exports.create = (req, res) => {
    if(!req.body.title){
        res.status(400).send({message: "Content can't be empty!"}); 
        return; 
    }

    const tutorial = new Tutorial({
        title: req.body.title, 
        description: req.body.description, 
        published: req.body.published ? req.body.published : false
    }); 

    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data); 
        })
        .catch(err =>{
            res.status(500).send({ 
                message: err.message || "Some error ocurred while creating the Tutorial. "
            })
        }); 
}; 

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const {title, page, size} = req.query;     
    var condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {}; 
    
    const {limit, offset} = getPagination(page, size); 

    Tutorial.paginate(condition, {offset, limit})    
    .then(data => {
        res.send({
            totalItems: data.totalDocs, 
            tutorials: data.docs, 
            totalPages: data.totalPages, 
            currentPage: data.page - 1
        }); 
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error ocurred while retrieving tutorials."
        })
    });
}; 

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id; 
    Tutorial.findById(id)
        .then(data => {
            if(!data)
                res.status(404).send({message: `Didn't find Tutorial with id ${id}`}); 
            else res.send(data);
        })
        .catch(err => {
            res 
            .status(500)
            .send({message: `Error retrieving Tutorial with id ${id}`}); 
        }); 
}; 


// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({
            nessage: `Data to update can't be empty`
        }); 
    }

    const id = req.params.id; 

    Tutorial.findByIdAndUpdate(id, req.body, {useFindAndModify:false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: `Cant't update Tutorial with id=${id}. Maybe tutorial was not found!`
                }); 
            }else res.send({ message: `Tutorial was updated successfully.`}); 

        })
        .catch(err => {
            res.status(500).send({
                message: `Error updating Tutorial with id=${id}`
            })
        });
}; 

// Delete a Tutorial by the id in the request
exports.delete = (req, res) => {
    const id = req.params.id; 
    Tutorial.findByIdAndRemove(id, {useFindAndModify:false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: `Can't delete Tutorial with id=${id}. Maybe tutorial was not found`
                });
            }else res.send({ message: `Tutorial was deleted successfully!`}); 
        })
        .catch(err => {
            res.status(500).send({
                message: `Could not delete Tutorial with id=${id}`
            });
        })
}; 

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => { 
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            })
        })
        .catch(err =>{ 
            req.status(500).send({ 
                message: err.message || `Some error ocurred while removing all tutorials`
            })
        })
}; 

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    const {page, size} = req.query; 
    const {limit, offset} = getPagination(page, size); 
    Tutorial
    .paginate({published: true}, {offset, limit})    
        .then(data =>{
            res.send({
                totalItems: data.totalDocs, 
                tutorials: data.docs, 
                totalPages: data.totalPages, 
                currentPage: data.page - 1
            }); 
        })
        .catch(err =>{
            res.status(500).send({
                message: 
                    err.message || `Some error ocurred while retrieving tutorials`
            })
        }); 
}; 
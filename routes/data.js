const router = require('express').Router();
const mongoose = require('mongoose');
const {checkValidationResult, addTasksSchema, editTaskSchema } = require('../validation');
const verifyToken = require('../validation/verifyToken');
const datasetModel = require('../models/dataset')

// user all tasks
router.get('/tasks', verifyToken, async(req,res)=>{
    try{
        const user_id = res.locals.user_id;
        datasetModel.findOne({ user_id: user_id }).select('todo doing done').exec((err, data) => {
            if(err){
                res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
            }
            res.status(200).send(data)
        })
    }
    catch(error){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})

//add new tasks
router.post('/tasks/add',addTasksSchema, checkValidationResult, verifyToken, async(req,res)=>{
    try{
        const dataset = await datasetModel.findOne({user_id:res.locals.user_id}).exec();
        if (!dataset || dataset === null || dataset === undefined){
            //add task with new dataset
            let newTask =  new datasetModel({
                _id:mongoose.Types.ObjectId(),
                user_id:res.locals.user_id,
                todo:[],
                doing:[],
                done:[]
            });
            newTask[req.body.taskstatus] = [
                {
                    _id:mongoose.Types.ObjectId(),
                    title:req.body.title,
                    desc:req.body.desc
                }
            ]
            newTask.save(function(err,savedTask){
                if (err){
                    res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
                }
                res.status(200).json({successMessage:"Task Added Successfully",successMessageDetails:{savedDataset:{todo:savedTask.todo, doing:savedTask.doing, done:savedTask.done}}});
            })
        }
        else if(dataset !== null && dataset !== undefined){
            let newTaskList = JSON.parse(JSON.stringify(dataset[req.body.taskstatus]))
            newTaskList.push({ _id:mongoose.Types.ObjectId(), title:req.body.title, desc:req.body.desc })
            dataset[req.body.taskstatus] = newTaskList
            dataset.save(function(err,savedTask){
                if (err){
                    return res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
                }
                res.status(200).json({successMessage:"Task Added Successfully",successMessageDetails:{savedDataset:{todo:savedTask.todo, doing:savedTask.doing, done:savedTask.done}}});
            })
        }
    }
    catch(err){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})

//sync tasks
router.post('/tasks/sync', verifyToken, async(req,res)=>{
    try{
        const dataset = await datasetModel.findOne({user_id:res.locals.user_id}).exec();
        if (!dataset || dataset === null || dataset === undefined){
            res.status(422).json({errorMessage:'Please add tasks before syncing.',errorMessageDetails:[] });
        }
        else if(dataset !== null && dataset !== undefined){
            dataset.todo = req.body.todo
            dataset.doing = req.body.doing
            dataset.done = req.body.done
            dataset.save(function(err,savedTask){
                if (err){
                    return res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
                }
                res.status(200).json({successMessage:"Task Added Successfully",successMessageDetails:{savedDataset:{todo:savedTask.todo, doing:savedTask.doing, done:savedTask.done}}});
            })
        }
    }
    catch(err){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})

//edit tasks
router.post('/tasks/edit/:id',editTaskSchema, checkValidationResult, verifyToken, async(req,res)=>{
    try{
        const dataset = await datasetModel.findOne({user_id:res.locals.user_id}).exec();
        if (!dataset || dataset === null || dataset === undefined){
            res.status(422).json({errorMessage:'Please add tasks before syncing.',errorMessageDetails:[] });
        }
        else if(dataset !== null && dataset !== undefined){
            let editIndex = dataset[req.body.oldtaskstatus].findIndex(el => el._id == req.params.id)
            if(editIndex === -1) return res.status(422).json({errorMessage:'Please add tasks before syncing.',errorMessageDetails:[] });
            dataset[req.body.oldtaskstatus][editIndex].title = req.body.title
            dataset[req.body.oldtaskstatus][editIndex].desc = req.body.desc
            if(req.body.oldtaskstatus !== req.body.taskstatus)
            {
                let removedElement =  dataset[req.body.oldtaskstatus].splice(editIndex,1)
                dataset[req.body.taskstatus].push(removedElement[0])
            }
            dataset.save(function(err,savedTask){
                if (err){
                    return res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
                }
                res.status(200).json({successMessage:"Task Added Successfully",successMessageDetails:{savedDataset:{todo:savedTask.todo, doing:savedTask.doing, done:savedTask.done}}});
            })
        }
    }
    catch(err){
        res.status(500).send({error:"Internal Server Error",errorMessageDetails:[]});
    }
})


module.exports = router;
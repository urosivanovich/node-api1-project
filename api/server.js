// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()
server.use(express.json())


// server.post('/api/users', async (req, res) => {
//     try {
//         if (!req.body.name || !req.body.bio) {
//             res.status(400).json({
//                 message: 'Please provide name and bio for the user'
//             })
//         } else {
//             const newUser = await User.insert(req.body)
//             res.status(201).json(newUser)
//         }
//     } catch(err) {
//         res.status(500).json({
//             message: 'There was an error while saving the user to the database',
//             error: err.message
//         })
//     }
// })

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    } else {
        User.insert(user)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(err => {
            res.status(500).json({
                message:'There was an error while saving the user to the database',
                error:err.message
            })
        })
    }
})


server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
       res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'The users information could not be retrieved',
            err: err.message
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({
                message:'The user with the specified ID does not exist'
            })
        } res.json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: 'The user information could not be retrieved',
            err: err.message
        })
    })
 
})

// server.delete('/api/users/:id', (req, res) => {
//     const { id } = req.params
//     User.remove(id)
//     .then(deletedUser => {
//         if(!deletedUser) {
//             res.status(404).json({
//                 message: 'The user with the specified ID does not exist'
//             })
//         }res.json(deletedUser)
//     })
//     .catch(err => {
//         res.status(500).json({
//             message: 'The user could not be removed',
//             error: err.message
//         })
//     })
// })

server.delete('/api/users/:id', async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if(!possibleUser){
        res.status(404).json({
            message: 'The user with the specified ID does not exist'
        })
    }else {
        const deletedUser = await User.remove(possibleUser.id)
        res.status(200).json(deletedUser)
    }
})

server.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findById(req.params.id)
        if(!updatedUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user'
            })
        } else {
            const user = await User.update(req.params.id, req.body)
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({
            message: 'The user information could not be modified',
            error: err.message
        })
    }

})






server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})


module.exports = server;

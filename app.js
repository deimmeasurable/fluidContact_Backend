const express = require("express");

const { sequelize, User, Contact } = require('./models')

const app = express()
app.use(express.json())

app.post('/user', async(req, res) =>{
    const {userName, password, email} = req.body

    const user = await User.findOne({
        where: {
            email: email
        }
    })
    if(user !== null){
        res.status(400).json("User already exist with that email")
    }

    try{
        const user = await User.create({userName, password, email})
        
        return res.json(user)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

//Get all users
app.get('/users', async(req, res) =>{
    try{
        const users = await User.findAll()
        if(users.length < 1){
            res.status(200).json({msg: "No users found"})
        }

        return res.json(users)
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Something went wrong"})
    }
})

// find user by uuid
app.get('/user/:uuid', async(req, res) =>{
    const uuid = req.params.uuid 
    try{
        const user = await User.findOne({
            where: {uuid},
            include: 'contact'
        })
        if(user === null){
            return res.status(400).json({error: `User with id ${uuid} not found`})
        }

        return res.json(user)
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Something went wrong"})
    }
})

//add a contact to user
app.post('/contact', async (req, res) =>{
    const {uuid, name, email, phoneNumber } = req.body;

    const contact = await Contact.findOne({
        where: {
            email: email
        }
    })
    if(contact !== null){
        res.status(400).json({msg: `Contact with email ${email} not found`})
    }
    try{
        const user = await User.findOne({
            where: {
                uuid: uuid
            }
        })
        console.log(user);

        const contact = await Contact.create({name, email, phoneNumber, userId:user.id})

        return res.json(contact)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

//get all contacts
app.get('/contacts', async (req, res) =>{
   
    try{
        const contacts = await Contact.findAll({include: [{ model: User, as: "user" }]})
        if(contacts.length < 1){
            res.status(200).json({message: "No users found"})
        }
        return res.json(contacts)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

//delete a contact 
app.delete('/contact/:id', async (req, res) =>{
    const id = req.params.id
    try{
        const contact = await Contact.findOne({
            where: {
                id: id
            }
        })
        if(contact === null){
            res.status(500).json({error: "No contact found"})
        }

        await contact.destroy()

        return res.json({ message: 'User deleted' })
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})

//update user
app.put('/contact/:id', async (req, res) =>{
    const id = req.param.id
    const {name,email, phoneNumber} = req.body
    try{
        const contact = await Contact.findOne({
            where: {
                id
            }
        })
        console.log(contact);

       contact.name = name
       contact.email = email
       contact.phoneNumber = phoneNumber

       await contact.save()

        return res.json(contact)
    }catch(err){
        console.log(err);
        return res.status(500).json(err)
    }
})



app.listen(process.env.PORT || 3000, async ()=>{
    console.log('Server upon http://localhost/3000');
    await sequelize.authenticate()
    console.log('Database connected!');
}) 
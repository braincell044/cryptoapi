const {Customer, validate} = require ('../model/customer')
const express = require ('express')
const router = express.Router()

// to show all product
router.get('/', async(req, res)=>{
    const customer = await Customer.find().sort('name');
    res.send(customer)
})

router.post('/', async(req, res)=>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

        let customer = new Customer({
            name: req.body.name,
            isGold:req.body.isGold,
            phoneNumber:req.body.phoneNumber
        })
        customer = await customer.save();

        res.send(customer)
})

router.put('/:id', async(req, res) =>{
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name},  
    {new:true})
     if(!customer) return res.status(400).send("user with the given id not found")
     res.send(customer)

})

router.get('/:id', async(req, res) =>{
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(400).send('The user with the given id not found');
    res.send(customer);

})

router.delete('/:id', async(req, res) =>{
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(400).send('The genre with the given id not found');
    res.send(customer);
})



module.exports = router
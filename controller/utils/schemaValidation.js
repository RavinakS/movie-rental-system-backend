const Joi = require('joi');

exports.userValidation = async (req, res, next) =>{
    let schema = Joi.object({
        name: Joi.string().pattern(/^[a-zA-Z ]+$/).min(3).max(16).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(15).required(),
        role: Joi.string().pattern(/^[a-zA-Z ]+$/).min(4).max(7)
    })

    validated = await schema.validate(req.body);

    if(validated.error){
        err_message = validated.error.details[0].message.split(" ")[0]
        if(err_message === `"name"`){
            res.status(400).send({status_code: 400, message: "Name should have, minimum 3 letters and max 16 letters, no numbers."});
        }else if(err_message === `"role"`){
            res.status(400).send({status_code: 400, message: "Role should be of min and max 4 and 7 letters, no numbers."});
        }
        else{
            res.status(400).send({status_code: 400, message: validated.error.details[0].message});
        }
    }else{
        req.validated = true;
        next()
    }
}

exports.movieValidation = async (req, res, next) =>{

    const rel_date = req.body.releasDate.toString().split('T')[0];

    let schema = Joi.object({
        name: Joi.string().required(),
        releasDate: Joi.date().required(),
        genre: Joi.string().required(),
        avalCD: Joi.number().required(),
        coins: Joi.number().required(),
        image: Joi.string()
    })

    const data = {
        name: req.body.name,
        releasDate: rel_date,
        genre: req.body.genre,
        avalCD: req.body.avalCD,
        coins: req.body.coins,
        image: req.file ? req.file.originalname : req.body.image
    }

    let validated = await schema.validate(data);
    if(validated.error){
        res.status(400).send({status_code: 400, message: validated.error.details[0].message});
    }else{
        req.validated = true;
        next()
    }
}

exports.returnMovieValidation = async (req, res, next) =>{
    const rel_date = req.body.releasDate.toString().split('T')[0];
    const rented_date = req.body.rentDate.toString().split('T')[0];
    const return_date = req.body.returnDate.toString().split('T')[0];
    
    const schema = Joi.object({
        name: Joi.string().required(),
        releasDate: Joi.date().required(),
        rentDate: Joi.date().required(),
        returnDate: Joi.date().required(),
        genre: Joi.string().required(),
        user: Joi.string().email().required()
    })

    const data = {
        name: req.body.name,
        releasDate: rel_date,
        rentDate: rented_date,
        returnDate: return_date,
        genre: req.body.genre,
        user: req.body.user
    }

    let validated = await schema.validate(data);
    if(validated.error){
        res.status(400).send({status_code: 400, message: validated.error.details[0].message});
    }else{
        req.dates = {rent_date: rented_date, return_date: return_date};
        req.validated = true;
        next()
    }
}

exports.fetchMovieValidation = async (req, res, next) =>{
    const rel_date = req.body.releasDate.toString().split('T')[0];
    const rented_date = req.body.rentDate.toString().split('T')[0];
    const fetch_date = req.body.fetchedOn.toString().split('T')[0];
    
    const schema = Joi.object({
        name: Joi.string().required(),
        releasDate: Joi.date().required(),
        rentDate: Joi.date().required(),
        fetchedOn: Joi.date().required(),
        genre: Joi.string().required(),
        user: Joi.string().email().required()
    })

    const data = {
        name: req.body.name,
        releasDate: rel_date,
        rentDate: rented_date,
        fetchedOn: fetch_date,
        genre: req.body.genre,
        user: req.body.user
    }

    let validated = await schema.validate(data);
    if(validated.error){
        res.status(400).send({status_code: 400, message: validated.error.details[0].message});
    }else{
        req.dates = {rent_date: rented_date, fetchedOn: fetch_date};
        req.validated = true;
        next()
    }
}
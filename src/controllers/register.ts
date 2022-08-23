import { Request, Response } from 'express';

interface UserContent {
    email: string;
    password: string;
    name: string;
}

const handleRegister = (db: any, bcrypt: any) => (req: Request<{}, any, UserContent>, res: Response) => {
    const{email, name, password} = req.body; 
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));

    db.transaction((trx: any) =>{
        trx.insert({
            hash: hashPassword,
            email: email
        })
        .into('login')
        .returning('email')
        .then((loginEmail: string[]) => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then((user: any) => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch((err: Error) => res.status(400).json('Unable to register'))
};

export default handleRegister;

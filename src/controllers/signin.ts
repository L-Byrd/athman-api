import { createSession, getAuthTokenId  } from '../tokens/token';
import { Request, Response } from 'express';

const handleSignIn =  (db: any, bcrypt: any, req: Request, res: Response) => {
    const{email, password} = req.body; 
    if(!email || !password){
        return Promise.reject('Incorrect form submission');
    }
    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then((data: any) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', email)
            .then((user: any) => user[0])
            .catch((err: Error) => Promise.reject('Unable to get user'))
        }else{
             Promise.reject('Wrong credentials');
        }
    }) 
    .catch((err: Error) => Promise.reject('Wrong credentials'))
 };

const signInAuthentication = (db: any , bcrypt: any) => (req: Request, res: Response) => {
    const { authorization } = req.headers; 
    return authorization ? 
    getAuthTokenId(req, res) : 
    handleSignIn(db, bcrypt, req, res)
    .then((data: any) => {
       return data.id && data.email ?
        createSession(data) : Promise.reject(data)
    })
    .then((session: any) => res.json(session))
    .catch((err: any) => res.status(400).json(err));
}

export default signInAuthentication;
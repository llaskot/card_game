import jwt from "jsonwebtoken";

export class Controller {
    _secretKey = 'fuck you'
    _salt = 'fucking salt'
    _password_salt = '1010'

    set_token(user_id) {
        return jwt.sign(
            {id: user_id},
            this._secretKey,
            {expiresIn: '10m'}
        )
    }
    set_password_token(password) {
        return jwt.sign(
            password,
            this._password_salt,
        )
    }

    // check_password_token(req, res) {
    //
    //     try {
    //         const token = req.headers.authorization.split(' ')[1]
    //         return jwt.verify(token, this._secretKey);
    //     } catch (err) {
    //         res.status(401).send(this.err_resp('Token expired.'))
    //         throw new Error('__token_failed__');
    //     }
    // }


    set_refresh(user_id, user_mail) {
        return jwt.sign(
            {id: user_id, mail: user_mail},
            this._salt,
            {expiresIn: '90m'}
        )
    }


    err_resp(message) {
        return {
            success: false,
            message: message
        }
    }

    check_token(req, res) {
        if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
            res.status(401).send(this.err_resp('Need token.'));
            throw new Error('__token_failed__');
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            return jwt.verify(token, this._secretKey);
        } catch (err) {
            res.status(401).send(this.err_resp('Token expired.'))
            throw new Error('__token_failed__');
        }
    }

    check_refresh(req, res) {
        if (!req.body.refresh){
                res.status(401).send(this.err_resp('Need refresh token.'));
                throw new Error('__refresh_failed__');
        }
        try {
            return jwt.verify(req.body.refresh, this._salt);
        } catch (err) {
            res.status(401).send(this.err_resp('Token refresh expired.'))
            throw new Error('__refresh_failed__');
        }
    }

}
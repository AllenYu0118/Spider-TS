import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator'
import { getResponseData } from '../utils/util'
import mysql from '../db/'

interface BodyRequest extends Request {
    body: { [key: string]: string | undefined };
}

@controller('/api')
export class LoginController {
    static isLogin(req: BodyRequest): boolean {
        return !!(req.session ? req.session.login : false)
    }

    @get('/isLogin')
    isLogin(req: BodyRequest, res: Response): void {
        const isLogin = LoginController.isLogin(req)
        const result = getResponseData<responseResult.isLogin>(isLogin)
        res.json(result)
    }

    @post('/login')
    login(req: BodyRequest, res: Response): void {
        const { password } = req.body
        const isLogin = LoginController.isLogin(req)

        if (isLogin) {
            const result = getResponseData<responseResult.login>(true)
            res.json(result)
        } else {
            if (password === '123' && req.session) {
                req.session.login = true
                const result = getResponseData<responseResult.login>(true)
                res.json(result)
            } else {
                res.json(getResponseData<responseResult.login>(false, '登录失败'))
            }
        }
    }

    @post('/register')
    register(req: BodyRequest, res: Response): void {
        const { username, password, email } = req.body
        const isLogin = LoginController.isLogin(req)

        if (isLogin) {
            const result = getResponseData<responseResult.login>(true)
            res.json(result)
        } else {
            mysql.query('insert into users(username, password, email) values (?,?,?);', [username, password, email], (err, results) => {
                if (err) throw err
                res.json('注册成功!')
            })
            // if (password === '123' && req.session) {
            //     req.session.login = true
            //     const result = getResponseData<responseResult.login>(true)
            //     res.json(result)
            // } else {
            //     res.json(getResponseData<responseResult.login>(false, '登录失败'))
            // }
        }
    }

    @get('/logout')
    logout(req: BodyRequest, res: Response): void {
        const isLogin = LoginController.isLogin(req)

        if (isLogin && req.session) {
            req.session.login = undefined
        }

        res.json(getResponseData<responseResult.loginout>(true))
    }
}

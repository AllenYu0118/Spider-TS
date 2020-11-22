import 'reflect-metadata';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
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
        const { username, password } = req.body
        const isLogin = LoginController.isLogin(req)

        if (isLogin) {
            const result = getResponseData<responseResult.login>(true)
            res.json(result)
        } else {
            mysql.query('select * from users where username=?', [username], (err, results) => {
                if (err) throw err

                if (results.length > 0) {
                    if (results[0].password === password && results[0].username === username && req.session) {
                        req.session.login = true
                        const token = 'Bearer ' + jwt.sign({ username: username }, 'Allen Yu', { expiresIn: '1h' })
                        const result = getResponseData<responseResult.login>(token)
                        res.json(result)
                    } else {
                        res.json(getResponseData<responseResult.login>(false, '登录失败'))
                    }
                } else {
                    res.json(getResponseData<responseResult.login>(false, '登录失败, 不存在此用户'))
                }
            })
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
            mysql.query('select * from users where username=?', [username], (err, results) => {
                if (err) throw err

                if (!results.length) {
                    mysql.query(
                        'insert into users(username, password, email) values (?,?,?);',
                        [username, password, email],
                        (err, results) => {
                            if (err) throw err
                            console.log(results)
                            res.json(getResponseData<responseResult.register>(true))
                        })
                } else {
                    res.json(getResponseData<responseResult.register>(false, '注册失败, 用户名已存在!'))
                }
            })
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

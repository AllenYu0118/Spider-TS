import 'reflect-metadata';
import { Request, Response } from 'express';
import { controller, get, post } from '../decorator'
import { getResponseData } from '../utils/util'

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
        const result = getResponseData<boolean>(isLogin)
        res.json(result)
    }

    @post('/login')
    login(req: BodyRequest, res: Response): void {
        const { password } = req.body
        const isLogin = LoginController.isLogin(req)

        if (isLogin) {
            const result = getResponseData<boolean>(true)
            res.json(result)
        } else {
            if (password === '123' && req.session) {
                req.session.login = true
                const result = getResponseData<boolean>(true)
                res.json(result)
            } else {
                res.json(getResponseData<boolean>(false, '登录失败'))
            }
        }
    }

    @get('/logout')
    logout(req: BodyRequest, res: Response): void {
        const isLogin = LoginController.isLogin(req)

        if (isLogin && req.session) {
            req.session.login = undefined
        }

        res.json(getResponseData<boolean>(true))
    }
}

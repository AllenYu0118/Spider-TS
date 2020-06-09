import path from 'path'
import fs from 'fs'
import { Router, Request, Response, NextFunction } from 'express'
import Crowller from './utils/crowller'
import DellAnalyzer from './utils/analyzer'
import { getResponseData } from './utils/util'

interface bodyRequest extends Request {
    body: { [key: string]: string | undefined }
}

const checkLogin = (req: bodyRequest, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : false
    if (isLogin) {
        next()
    } else {
        res.json(getResponseData(null, '请先登录'))
    }
}

const router = Router()


router.post('/login', (req: bodyRequest, res: Response) => {
    const { password } = req.body
    const isLogin = req.session ? req.session.login : false

    if (isLogin) {
        res.json(getResponseData(null, '已经登录过'))
    } else {
        if (password === '123' && req.session) {
            req.session.login = true
            res.json(getResponseData(true))
        } else {
            res.json(getResponseData(null, '登录失败'))
        }
    }
})

router.get('/getData', checkLogin, (req: bodyRequest, res: Response) => {
    const secret = 'soga9527'
    const url = `http://www.dell-lee.com/?secret=${secret}`
    const analyzer = DellAnalyzer.getInsatance()

    new Crowller(url, analyzer)
    res.json(getResponseData(true))
})

router.get('/showData', checkLogin, (req: bodyRequest, res: Response) => {
    try {
        const fileContent = fs.readFileSync(path.resolve(__dirname, '../data/course.json'), 'utf-8')
        res.json(getResponseData(JSON.parse(fileContent)))

    } catch (e) {
        res.json(getResponseData(null, '展示文件不存在!'))
    }
})

export default router
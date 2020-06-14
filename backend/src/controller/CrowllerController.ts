import fs from 'fs'
import path from 'path'

import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { controller, use, get } from '../decorator'
import { getResponseData } from '../utils/util'
import Crowller from '../utils/crowller'
import DellAnalyzer from '../utils/analyzer'

interface BodyRequest extends Request {
    body: { [key: string]: string | undefined }
}
interface CourseItem {
    title: string,
    count: number
}

interface DataStructure {
    [key: string]: CourseItem[]
}

const checkLogin = (req: BodyRequest, res: Response, next: NextFunction): void => {
    const isLogin = !!(req.session ? req.session.login : false)
    if (isLogin) {
        next()
    } else {
        res.json(getResponseData(null, '请先登录'))
    }
}

@controller('/api')
export class CrowllerController {
    @get('/getData')
    @use(checkLogin)
    getData(req: BodyRequest, res: Response): void {
        const secret = 'soga9527'
        const url = `http://www.dell-lee.com/?secret=${secret}`
        const analyzer = DellAnalyzer.getInsatance()

        new Crowller(url, analyzer)
        res.json(getResponseData<boolean>(true))
    }

    @get('/showData')
    @use(checkLogin)
    showData(req: BodyRequest, res: Response): void {
        try {
            const fileContent = fs.readFileSync(path.resolve(__dirname, '../../data/course.json'), 'utf-8')
            res.json(getResponseData<DataStructure>(JSON.parse(fileContent)))

        } catch (e) {
            res.json(getResponseData<boolean>(false, '展示文件不存在!'))
        }
    }
}

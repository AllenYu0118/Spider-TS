import { Router, Request, Response } from 'express'

import Crowller from './crowller'
import DellAnalyzer from './dellAnalyzer'

const router = Router()


router.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <form method="post" action="/getData">
                    <input type="password" name="password">
                    <button>提交</button>
                </form>
            </body>
        </html>
    `)
})

router.get('/login')

router.post('/getData', (req: Request, res: Response) => {
    console.log(req.body)
    if (req.body.password === '123') {
        const secret = 'soga9527'
        const url = `http://www.dell-lee.com/?secret=${secret}`
        const analyzer = DellAnalyzer.getInsatance()

        new Crowller(url, analyzer)
        res.send('getData Success!')
    } else {
        res.send('password Error!')
    }

})

export default router
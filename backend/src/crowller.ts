import fs from 'fs'
import path from 'path'

import superagent from 'superagent'

import DellAnalyzer from './dellAnalyzer'
// import AllenAnalyzer from './allenAnalyzer'

export interface Analyzer {
    analyze: (html: string, filePath: string) => string
}

class Crowller {
    private filePath = path.resolve(__dirname, '../data/course.json')

    constructor(private url: string, private analyzer: Analyzer) {
        this.initSpiderProcess()
    }

    private async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }

    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content)
    }

    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        const fileContent = this.analyzer.analyze(html, this.filePath)
        this.writeFile(fileContent)
    }
}
const secret = 'soga9527'
const url = `http://www.dell-lee.com/?secret=${secret}`
const analyzer = DellAnalyzer.getInsatance()
// const analyzer = new AllenAnalyzer()

const crowller = new Crowller(url, analyzer)

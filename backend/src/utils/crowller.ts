import superagent from 'superagent'

export interface Analyzer {
    analyze: (html: string) => string
}

export default class Crowller {
    constructor(private url: string, private analyzer: Analyzer) {
        this.initSpiderProcess()
    }

    private async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }

    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        this.analyzer.analyze(html)
    }
}

import cheerio from 'cheerio'
import { Analyzer } from './crowller'
import dayjs from 'dayjs'
import mysql from '../db/'

interface Course {
    author: string
    star: number | string
    name: string
}

interface CourseResult {
    time: number
    data: Course
}

export default class GithubAnalyzer implements Analyzer {
    private static instance: GithubAnalyzer

    static getInsatance() {
        if (!GithubAnalyzer.instance) {
            GithubAnalyzer.instance = new GithubAnalyzer()
        }
        return GithubAnalyzer.instance
    }

    private getCourseInfo(html: string) {
        const $ = cheerio.load(html)
        const star = $('.js-social-count').attr('aria-label')?.split(' ')[0]
        const author = $('.author').find('a').text()
        const name = $('.mr-2.flex-self-stretch').find('a').text()

        return {
            time: new Date().getTime(),
            data: {
                author,
                name,
                star: star || 0
            }
        }
    }

    private generateJsonContent(courseInfo: CourseResult) {
        let data = courseInfo.data
        let { author, name, star } = data
        mysql.query(
            'insert into github(author, name, star, datetime) values (?,?,?,?);',
            [author, name, star, dayjs().format('YYYY-MM-DD HH-mm-ss')],
            (err) => {
                if (err) throw err
            })
    }

    public analyze(html: string) {
        const courseInfo = this.getCourseInfo(html)
        const fileContent = this.generateJsonContent(courseInfo)

        return JSON.stringify(fileContent)
    }
}
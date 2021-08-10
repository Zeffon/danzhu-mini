/**
 * Create by Zeffon on 2020/10/3
 */

import {Http} from "./http";

class Paging {
    // 不关心细节，借助于生成器(Generator)的思想
    // 需要保存对象的状态，也就是说每次都要实例化 new Paging

    start
    count
    req
    locker = false
    url
    moreData = true
    accumulator = []

    constructor(req, count = 20, start = 0) {
        this.count = count
        this.start = start
        this.req = req
        this.url = req.url
    }

    async getMoreData() {
        if (!this.moreData) {
            return 
        }
        //数据锁
        if(!this._getLocker())
            return

        const data = await this._actualGetData()
        this._releaseLocker()
        return data
    }

    // 获取数据
    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)
        // 服务端请求失败，返回空
        if(!paging) {
            return null
        }
        // 一条数据都没有
        if (paging.total === 0) {
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }

        this.moreData = Paging._moreData(paging.total_page, paging.page)
        if(this.moreData) {
            this.start += this.count
        }
        this._accumulate(paging.items)
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator
        }
    }

    _accumulate(items) {
        this.accumulator = this.accumulator.concat(items)
    }

    // 是否还有更多数据
    static _moreData(totalPage, pageNum) {
        return pageNum < totalPage - 1
    }

    // 拼装url
    _getCurrentReq() {
        let url = this.url
        const params = `start=${this.start}&count=${this.count}`
        if(url.includes('?')) {
            url += '&' + params
        } else {
            url += '?' + params
        }
        this.req.url = url
        return this.req
    }

    // 判断是否锁住
    _getLocker() {
        if(this.locker) {
            return false
        }
        this.locker = true
        return true
    }

    // 解锁
    _releaseLocker() {
        this.locker = false
    }

}

export {
    Paging
}

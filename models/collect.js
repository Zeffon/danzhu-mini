import { Paging } from '../utils/paging';
import { Http } from "../utils/http";

class Collect {

    static async createCollect(title, summary, valid_period, user_limit, group_id) {
        return await Http.request({
            url: `collect/create`,
            method: 'POST',
            data: {
                title,
                summary,
                valid_period,
                user_limit,
                group_id
            }
        })
    }

    static async getDetail(cid) {
        return await Http.request({
            url: `collect/detail/${cid}`
        })
    }

    static async userAddCollect(id) {
        return await Http.request({
            url: `collect/user/add`,
            method: 'POST',
            data: {
                id
            }
        })
    }

    static getPagingByType(type) {
        return new Paging({
            url: `collect/list/${type}`
        })
    }

    static async deleteCollect(ids) {
        return await Http.request({
            url: `collect/disband`,
            data: {
                ids
            },
            method: 'DELETE'
        })
    }

    static listUserCollect(cid) {
        return new Paging({
            url: `collect/list/user?cid=${cid}`
        })
    }

    static async updateCollect(cid, title, summary, valid_period, user_limit) {
        return await Http.request({
            url: `collect/update`,
            method: 'POST',
            data: {
                cid,
                title,
                summary,
                valid_period,
                user_limit
            }
        })
    }

    static async getStatByBar(cid) {
        return await Http.request({
            url: `collect/stat/bar/${cid}`,
        })
    }

    static async getStatByGauge(cid) {
        return await Http.request({
            url: `collect/stat/gauge/${cid}`,
        })
    }

    static async getStatByLine(cid) {
        return await Http.request({
            url: `collect/stat/line/${cid}`,
        })
    }

    static async getStatByPie(cid) {
        return await Http.request({
            url: `collect/stat/pie/${cid}`,
        })
    }

    static async deleteUser(uid, cid) {
        return await Http.request({
            url: `collect/admin/delete`,
            data: {
                uid, cid
            },
            method: 'DELETE'
        })
    }

}

export {
    Collect
}
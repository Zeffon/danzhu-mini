import { Paging } from '../utils/paging';
import { Http } from "../utils/http";

class File {

    static async uploadFile(cid, title, url, size, category) {
        return await Http.request({
            url: `file/user/upload`,
            data: {
                cid, title, url, size, category
            },
            method: 'POST'
        })
    }

    static async adminUploadFile(uid, cid, title, url, size, category) {
        return await Http.request({
            url: `file/admin/upload`,
            data: {
                uid, cid, title, url, size, category
            },
            method: 'POST'
        })
    }

    static async getUploadFile(uid, cid) {
        return await Http.request({
            url: `file/list/${uid}/${cid}`,
        })
    }

    static async adminDeleteFile(fid) {
        return await Http.request({
            url: `file/admin/delete/${fid}`,
            method: 'DELETE'
        })
    }

    static getPagingFile(type) {
        return new Paging({
            url: `file/page/${type}`
        })
    }

    static async listMonthFile() {
        return await Http.request({
            url: `file/list/month`,
        })
    }

    static async listLetterFile() {
        return await Http.request({
            url: `file/list/letter`,
        })
    }

    static async listFileByCid(cid) {
        return await Http.request({
            url: `file/list/by/${cid}`,
        })
    }

    static async setOnline(id, online) {
        return await Http.request({
            url: `file/update/online`,
            method: 'POST',
            data: {
                id,
                online
            }
        })
    }

    static async countFile() {
        return await Http.request({
            url: `file/count`,
        })
    }
    
    static async listTrashFile() {
        return await Http.request({
            url: `file/list/trash`,
        })
    }

    static async listMyShareFile() {
        return await Http.request({
            url: `file/list/share/my`,
        })
    }

    static async listShareFile(uid) {
        return await Http.request({
            url: `file/list/share/${uid}`,
        })
    }

    static async restoreFile(id) {
        return await Http.request({
            url: `file/restore/${id}`,
            method: 'POST'
        })
    }

    static async realDelete(id) {
        return await Http.request({
            url: `file/real/${id}`,
            method: 'DELETE'
        })
    }

}

export {
    File
}
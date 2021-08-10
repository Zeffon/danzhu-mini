import { Http } from "../utils/http";
import { File } from "../models/file";
import { getLineYMD } from "../utils/date";
import { FileCategory } from "../core/enum";

class Oss {

    static async getPolicy() {
        return await Http.request({
            url: `oss/policy`
        })
    }

    static async uploadImage(file, index, oss, cid) {
        // 由于图片无法获取到文件名，采用时间格式命名 + 随机数 + 上传个数索引值 
        // 获取文件目录中最后一个.的位置
        let i = file.path.lastIndexOf(".")
        // 获取后缀
        let ext = file.path.substr(i)
        let extTemp = ext.toUpperCase()
        if (extTemp !== '.PNG' && extTemp !== '.JPG' && extTemp !== '.JPEG' && extTemp !== '.GIF') {
            return ''
        }
        const date = new Date
        let timestamp = date.getTime().toString().substr(7);
        let filename = getLineYMD(date) + " " + timestamp + " " + (index + 1) + ext
        let key = oss.dir + filename
        const uploadTask = wx.uploadFile({
            url: oss.host, // 开发者服务器的URL。
            filePath: file.path,
            name: 'file', // 必须填file。
            formData: {
                "OSSAccessKeyId": oss.access_key_id,
                "policy": oss.policy,
                "Signature": oss.signature,
                "key": key,
                "success_action_status": '201'
            },
            success: res => {
                let title = filename
                let url = oss.host + "/" + key
                let size = file.size
                this.userUpload(cid, title, url, size, FileCategory.IMAGE)
            }
        })
        return uploadTask
    }

    static async uploadFile(file, index, oss, cid) {
        let filename = file.name
        let key = oss.dir + filename
        const uploadTask = wx.uploadFile({
            url: oss.host, // 开发者服务器的URL。
            filePath: file.path,
            name: 'file', // 必须填file。
            formData: {
                "OSSAccessKeyId": oss.access_key_id,
                "policy": oss.policy,
                "Signature": oss.signature,
                "key": key,
                "success_action_status": '201'
            },
            success: res => {
                let title = filename
                let url = oss.host + "/" + key
                let size = file.size
                let i = filename.lastIndexOf(".")
                let ext = filename.substr(i)
                let extTemp = ext.toUpperCase()
                if (extTemp === '.PNG' || extTemp === '.JPG' || extTemp === '.JPEG' || extTemp === '.GIF') {
                    this.userUpload(cid, title, url, size, FileCategory.IMAGE)
                } else {
                    this.userUpload(cid, title, url, size, FileCategory.FILE)
                }
            }
        })
        return uploadTask
    }

    static async userUpload(cid, title, url, size, category) {
        await File.uploadFile(cid, title, url, size, category)
    }

}

export {
    Oss
}
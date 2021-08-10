
import { Http } from "../utils/http";

class Permission {
    static async getShareBtn() {
        return await Http.request({
            url: `permission/share`,
            method: 'GET'
        })
    }
}

export {
    Permission
}
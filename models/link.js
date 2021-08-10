
import { Http } from "../utils/http";

class Link {
    static async createLink(cid, status, code) {
        return await Http.request({
            url: `link/create`,
            data: {
                cid, status, code
            },
            method: 'POST'
        })
    }
}

export {
    Link
}
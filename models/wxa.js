
import { Http } from "../utils/http";

class Wxa {
    static async generateWxaCode(scene, page, width) {
        return await Http.request({
            url: `wxa`,
            method: 'POST',
            data: {
                scene,
                page,
                width
            }
        })
    }

    static async getAccessToken() {
        return await Http.request({
            url: `wxa`
        })
    }
}

export {
    Wxa
}
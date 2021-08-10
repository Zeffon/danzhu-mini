import {Paging} from "../utils/paging";
import {Http} from "../utils/http";

class Search {

  static async search(q) {
    return await Http.request({
      url: `search/${q}`
    })
  }

  static async getHotWord(q) {
    return await Http.request({
      url: `search/hotWord`
    })
  }

}

export {
  Search
}
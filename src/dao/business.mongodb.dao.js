import BusinessModel from "./models/business.model.js";

export default class BusinessMongoDbDao {
    static get(criteria = {}, opts = {}) {
        return BusinessModel.find(criteria, opts);
    }
    static getById(oid) {
        return BusinessModel.findById(oid);
    }
    static create(data) {
        return BusinessModel.create(data);
    }
    static updateById(oid, data) {
        const criteria = { _id: oid };
        const operation = { $set: data }
        return BusinessModel.updateOne(criteria, operation);
    }
    static deleteById(uid) {
        const criteria = { _id: uid };
        return BusinessModel.deleteOne(criteria);
    }

}
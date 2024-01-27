import CartModel from "./models/cart.model.js";

export default class CartMongoDbDao {
    static get(criteria = {}, opts = {}) {
        return CartModel.find(criteria, opts);
    }
    static getById(cid) {
        return CartModel.findById(cid);
    }
    static create(data) {
        return CartModel.create(data);
    }
    static updateById(cid, data) {
        const criteria = { _id: cid };
        const operation = { $set: data }
        return CartModel.updateOne(criteria, operation);
    }
    static deleteById(uid) {
        const criteria = { _id: uid };
        return CartModel.deleteOne(criteria);
    }

}
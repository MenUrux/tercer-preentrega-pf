import TicketModel from './models/ticket.model.js';

export default class TicketMongoDbDao {
    // Obtener tickets con criterios y opciones opcionales
    static get(criteria = {}, opts = {}) {
        return TicketModel.find(criteria, {}, opts);
    }

    // Obtener un ticket por su ObjectId
    static getById(oid) {
        return TicketModel.findById(oid).populate('purchaser');
    }

    // Crear un nuevo ticket
    static create(data) {
        const ticket = new TicketModel(data);
        return ticket.save();
    }

    // Actualizar un ticket por su ObjectId
    static updateById(oid, data) {
        const criteria = { _id: oid };
        const operation = { $set: data };
        const options = { new: true }; // Devuelve el documento modificado
        return TicketModel.findOneAndUpdate(criteria, operation, options);
    }

    // Borrar un ticket por su ObjectId
    static deleteById(oid) {
        const criteria = { _id: oid };
        return TicketModel.deleteOne(criteria);
    }
}

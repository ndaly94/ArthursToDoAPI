const { model, Schema } = require('mongoose')

const todoSchema = new Schema ({
    title: { required: true, type: String },
    completed: { type: Boolean, required: true },
    // this is what allows us to have everytime we create a ToDo it belongs to a certain user. 
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
}, {
    timestamps: true
})

const Todo = model('Todo', todoSchema)

module.exports = Todo
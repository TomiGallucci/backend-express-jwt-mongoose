const mongoose = require('mongoose'),
      { Schema } = mongoose,
      bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    fullname: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    age: { type: Number, required: true},
    weight: {type: Array, required: true},
    date: { type: Date, default:  Date.now()},
    create_at: { type: Date, default:  Date.now()},
    update_at: { type: Date, default:  Date.now()}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Users', UserSchema);
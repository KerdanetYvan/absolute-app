import mongoose, { Schema, model, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface IUser {
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est requis'],
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Le mot de passe est requis']
  }
}, {
  timestamps: true
});

UserSchema.plugin(uniqueValidator, { message: '{PATH} doit être unique' });

const User: Model<IUser>= mongoose.models.User || model<IUser>('User', UserSchema);
export default User;

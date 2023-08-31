import mongoose from "mongoose";
import IRole from "../interfaces/RoleInterface.js";

const RoleSchema = new mongoose.Schema<IRole>({
    name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
    }
});

const RoleModel = mongoose.model<IRole>("Role", RoleSchema);

export default RoleModel;
    
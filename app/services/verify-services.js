import { Account, Verification } from '../models/index.js';

export const findUserByToken = async (token) => {
    // join the Verification and Account tables
    const record = await Verification.findOne({
        where: { token },
        include: {
            model: Account,
            as: 'user',
        },
    });
    
    return record;
}

export const updateUserVerificationStatus = async (id, is_verified) => {
    await Account.update({ is_verified }, { where: { id } });
}
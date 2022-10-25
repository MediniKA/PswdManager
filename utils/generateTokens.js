const jwt = require('jsonwebtoken');
const UserToken =require('../models/refreshTokenModel');

const generateTokens = async (existingUser) => {
	try {
		const accessToken = jwt.sign(
			{mobileNumber:existingUser.mobileNumber,id:existingUser._id },
			process.env.SECRET,
			{ expiresIn: "10m" }
		);
		const refreshToken = jwt.sign(
			{mobileNumber:existingUser.mobileNumber,id:existingUser._id },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "10d" }
		);

		const userToken = await UserToken.findOne({ userId: existingUser.userId  });
		if (userToken) await userToken.remove(); // remove matched document with old refresh token

		await new UserToken({ userId: existingUser.userId, refreshToken: refreshToken }).save(); // create new document with new refresh token
		return Promise.resolve({ accessToken, refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports = generateTokens;
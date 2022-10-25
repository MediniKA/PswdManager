const UserToken = require('../models/refreshTokenModel');
const jwt = require('jsonwebtoken');

const verifyRefreshToken = (refreshToken) => {
	const privateKey = process.env.REFRESH_TOKEN_SECRET;

	return new Promise((resolve, reject) => {
		UserToken.findOne({ refreshToken: refreshToken}, (err, doc) => {
			if (!doc)
				return reject({ error: true, message: "Invalid refresh token" });  // if there is no document to verify refresh token then return error response

			jwt.verify(refreshToken.toString(), privateKey.toString(), (err, tokenDetails) => { // compare refresh tokens
				if (err)
					return reject({ error: true, message: "Invalid refresh token" });
                    console.log(tokenDetails)
				resolve({
					tokenDetails,
					error: false,
					message: "Valid refresh token",
				});
			});
		});
	});
};

module.exports = verifyRefreshToken;
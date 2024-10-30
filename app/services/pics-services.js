import Image from "../models/image-model.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws.js";

export const postPic = async (id, file) => {
	const fileName = `${id}/${file.originalname}`;
	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	// Check if the user already has an image
	const image = await Image.findOne({ where: { user_id: id } });
	if (image) return "duplicate";

	// Upload the file to S3
	try {
		// Put an object into an Amazon S3 bucket.
		const data = await s3Client.send(new PutObjectCommand(params));
		// Create a record in the database
		const imageCreated = Image.create({
			file_name: file.originalname,
			url: fileName,
			user_id: id,
		});
		return imageCreated;
	} catch (error) {
		console.error("Error uploading file:", error);
		return "bad request";
	}
};

export const getPic = async (id) => {
	// Find the image record in the database
	const image = await Image.findOne({ where: { user_id: id } });
	if (image) {
		return image;
	}
	return "not found";
};

export const deletePic = async (id) => {
	const image = await Image.findOne({ where: { user_id: id } });
	if (image) {
		// Delete the file from S3
		try {
			const result = await s3Client.send(
				new DeleteObjectCommand({
					Bucket: process.env.S3_BUCKET_NAME,
					Key: image.url,
				})
			);
		} catch (error) {
			console.error("Error deleting file:", error);
			return "bad request";
		}
		// Delete the record from the database
		await Image.destroy({ where: { user_id: id } });
		return image;
	}
	return "not found";
};

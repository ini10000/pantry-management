import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import vision from "@google-cloud/vision";
import path from "path";
import fetch from "node-fetch";

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), "service-account-key.json"),
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { imageFile } = req.body;

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `uploads/${imageFile.name}`);
      await uploadBytes(storageRef, Buffer.from(imageFile.data, "base64"));

      const imageUrl = await getDownloadURL(storageRef);

      // Call Google Cloud Vision API for classification
      const [result] = await client.labelDetection(imageUrl);
      const labels = result.labelAnnotations;

      res.status(200).json({ imageUrl, classification: labels });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to classify image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
